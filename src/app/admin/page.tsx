'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LEDScreen } from '@/lib/supabase'
import { ClipRequirement, defaultClipsData } from '@/data/clipsData'
import { useAuth } from '@/hooks/useAuth'
import LoginForm from '@/components/LoginForm'

export default function AdminPanel() {
  const { isAuthenticated, isLoading: authLoading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('screens')
  const [screens, setScreens] = useState<LEDScreen[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingScreen, setEditingScreen] = useState<LEDScreen | null>(null)
  
  // Clips data state
  const [clipsData, setClipsData] = useState<ClipRequirement[]>(defaultClipsData)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [draggedScreen, setDraggedScreen] = useState<string | null>(null)

  // Drag and drop functions
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedItem(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault()
    if (!draggedItem) return

    const newClipsData = [...clipsData]
    const draggedIndex = newClipsData.findIndex(item => item.id === draggedItem)
    const targetIndex = newClipsData.findIndex(item => item.id === targetId)

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedItemData] = newClipsData.splice(draggedIndex, 1)
      newClipsData.splice(targetIndex, 0, draggedItemData)
      setClipsData(newClipsData)
    }

    setDraggedItem(null)
  }

  // Screen drag and drop functions
  const handleScreenDragStart = (e: React.DragEvent, screenId: string) => {
    setDraggedScreen(screenId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleScreenDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleScreenDrop = async (e: React.DragEvent, targetScreenId: string) => {
    e.preventDefault()
    if (!draggedScreen || draggedScreen === targetScreenId) return

    try {
      // Get current screens
      const newScreens = [...screens]
      const draggedIndex = newScreens.findIndex(screen => screen.id === draggedScreen)
      const targetIndex = newScreens.findIndex(screen => screen.id === targetScreenId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Move screen in array
        const [draggedScreenData] = newScreens.splice(draggedIndex, 1)
        newScreens.splice(targetIndex, 0, draggedScreenData)

        // Update display_order for all screens
        for (let i = 0; i < newScreens.length; i++) {
          await supabase
            .from('led_screens')
            .update({ display_order: i })
            .eq('id', newScreens[i].id)
        }

        // Update local state
        setScreens(newScreens)
        console.log('Screen order updated successfully')
      }
    } catch (error) {
      console.error('Error updating screen order:', error)
      alert('Klaida atnaujinant ekranų eiliškumą')
    }

    setDraggedScreen(null)
  }

  const handleTooltipChange = (id: number, newTooltip: string) => {
    setClipsData(prev => prev.map(item => 
      item.id === id ? { ...item, tooltip: newTooltip } : item
    ))
  }

  const addNewClip = () => {
    console.log('Adding new clip, current clipsData:', clipsData)
    const newId = clipsData.length > 0 ? Math.max(...clipsData.map(item => item.id)) + 1 : 1
    const newClip = {
      id: newId,
      city: 'Naujas miestas',
      format: 'Horizontalus',
      width: '1920',
      height: '1080',
      tooltip: 'Įveskite ekranų pavadinimus'
    }
    console.log('New clip:', newClip)
    setClipsData(prev => {
      console.log('Previous state:', prev)
      const newState = [...prev, newClip]
      console.log('New state:', newState)
      return newState
    })
  }

  const removeClip = (id: number) => {
    setClipsData(prev => prev.filter(item => item.id !== id))
  }

  const saveClipsData = () => {
    console.log('Saving clips data:', clipsData)
    // Išsaugome localStorage
    localStorage.setItem('clipsData', JSON.stringify(clipsData))
    alert(`Išsaugota ${clipsData.length} eilučių!`)
  }

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    address: '',
    latitude: '',
    longitude: '',
    image_url: '',
    mobile_image_url: '',
    description: '',
    is_double_sided: false,
    is_video: false,
    is_static: false,
    is_viaduct: false,
    side_a_name: '',
    side_b_name: '',
    side_a_image_url: '',
    side_b_image_url: '',
    side_a_mobile_image_url: '',
    side_b_mobile_image_url: '',
    size: '',
    resolution: '',
    traffic: '',
    price: '',
    is_last_minute: false,
      last_minute_date: ''
  })
  const [uploading, setUploading] = useState(false)

  const fetchScreens = async () => {
    try {
      const { data, error } = await supabase
        .from('led_screens')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setScreens(data || [])
    } catch (error) {
      console.error('Error fetching screens:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchScreens()
    }
  }, [isAuthenticated])

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Tikrinama autentifikacija...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate coordinates
      const lat = parseFloat(formData.latitude)
      const lng = parseFloat(formData.longitude)
      
      if (isNaN(lat) || isNaN(lng)) {
        alert('Neteisingos koordinatės. Įveskite skaičius.')
        return
      }

      // Validate coordinate ranges for Lithuania
      if (lat < 53.9 || lat > 56.4 || lng < 20.9 || lng > 26.8) {
        alert('Koordinatės turi būti Lietuvos teritorijoje (platuma: 53.9-56.4, ilguma: 20.9-26.8)')
        return
      }

      const screenData = {
        name: formData.name,
        city: formData.city,
        district: formData.district,
        address: formData.address,
        coordinates: `${lat},${lng}`, // Alternative format
        image_url: formData.image_url,
        description: formData.description || null,
        is_double_sided: formData.is_double_sided,
        is_video: formData.is_video,
        is_static: formData.is_static,
        is_viaduct: formData.is_viaduct,
        side_a_name: formData.side_a_name || null,
        side_b_name: formData.side_b_name || null,
        side_a_image_url: formData.side_a_image_url || null,
        side_b_image_url: formData.side_b_image_url || null,
        size: formData.size || null,
        resolution: formData.resolution || null,
        traffic: formData.traffic || null,
        price: formData.price ? parseFloat(formData.price) : null,
        is_active: true,
        display_order: screens.length,
        // Temporarily commented out last minute fields
        // is_last_minute: formData.is_last_minute || false,
        // last_minute_date: formData.last_minute_date || null
      }

      console.log('Saving screen data:', screenData)
      console.log('Screen data keys:', Object.keys(screenData))
      console.log('Full screen data object:', JSON.stringify(screenData, null, 2))

      if (editingScreen) {
        // Update existing screen
        const { data, error } = await supabase
          .from('led_screens')
          .update(screenData)
          .eq('id', editingScreen.id)
          .select()

        if (error) {
          console.error('Update error:', error)
          console.error('Error details:', JSON.stringify(error, null, 2))
          throw error
        }
        console.log('Updated screen:', data)
      } else {
        // Create new screen
        const { data, error } = await supabase
          .from('led_screens')
          .insert([screenData])
          .select()

        if (error) {
          console.error('Insert error:', error)
          console.error('Insert error details:', JSON.stringify(error, null, 2))
          throw error
        }
        console.log('Created screen:', data)
      }

      // Reset form
      setFormData({
        name: '',
        city: '',
        district: '',
        address: '',
        latitude: '',
        longitude: '',
        image_url: '',
        mobile_image_url: '',
        description: '',
        is_double_sided: false,
        is_video: true,
        is_static: false,
        is_viaduct: false,
        side_a_name: '',
        side_b_name: '',
        side_a_image_url: '',
        side_b_image_url: '',
        side_a_mobile_image_url: '',
        side_b_mobile_image_url: '',
        size: '',
        resolution: '',
        traffic: '',
        price: '',
        is_last_minute: false,
      last_minute_date: ''
      })
    setShowForm(false)
    setEditingScreen(null)
      fetchScreens()
    } catch (error: unknown) {
      console.error('Error saving screen:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      alert(`Klaida išsaugant ekraną: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
    }
  }

  const handleEdit = (screen: LEDScreen) => {
    console.log('Editing screen coordinates:', screen.coordinates, typeof screen.coordinates)
    console.log('Editing screen image_url:', screen.image_url)
    
    // Handle different coordinate formats
    let latitude = '0'
    let longitude = '0'
    
    if (Array.isArray(screen.coordinates)) {
      latitude = screen.coordinates[0].toString()
      longitude = screen.coordinates[1].toString()
    } else if (screen.coordinates && typeof screen.coordinates === 'object') {
      // POINT object format
      latitude = (screen.coordinates as any).x?.toString() || '0'
      longitude = (screen.coordinates as any).y?.toString() || '0'
    } else if (typeof screen.coordinates === 'string') {
      // String format like "(54.6872, 25.2797)"
      const match = (screen.coordinates as string).match(/\(([^,]+),\s*([^)]+)\)/)
      if (match) {
        latitude = match[1]
        longitude = match[2]
      }
    }
    
    setFormData({
      name: screen.name,
      city: screen.city,
      district: screen.district,
      address: screen.address,
      latitude: latitude,
      longitude: longitude,
      image_url: screen.image_url || '',
      mobile_image_url: screen.mobile_image_url || '',
      description: screen.description || '',
      is_double_sided: screen.is_double_sided || false,
      is_video: screen.is_video || false,
      is_static: screen.is_static || false,
      is_viaduct: screen.is_viaduct || false,
      side_a_name: screen.side_a_name || '',
      side_b_name: screen.side_b_name || '',
      side_a_image_url: screen.side_a_image_url || '',
      side_b_image_url: screen.side_b_image_url || '',
      side_a_mobile_image_url: screen.side_a_mobile_image_url || '',
      side_b_mobile_image_url: screen.side_b_mobile_image_url || '',
      size: screen.size || '',
      resolution: screen.resolution || '',
      traffic: screen.traffic || '',
      price: screen.price?.toString() || '',
      is_last_minute: screen.is_last_minute || false,
      last_minute_date: screen.last_minute_date || '',
    })
    setEditingScreen(screen)
    setShowForm(true)
  }

  const handleCopy = (screen: LEDScreen) => {
    console.log('Copying screen:', screen.name)
    
    // Handle different coordinate formats
    let latitude = '0'
    let longitude = '0'
    
    if (Array.isArray(screen.coordinates)) {
      latitude = screen.coordinates[0].toString()
      longitude = screen.coordinates[1].toString()
    } else if (screen.coordinates && typeof screen.coordinates === 'object') {
      // POINT object format
      latitude = (screen.coordinates as any).x?.toString() || '0'
      longitude = (screen.coordinates as any).y?.toString() || '0'
    } else if (typeof screen.coordinates === 'string') {
      // String format like "(54.6872, 25.2797)"
      const match = (screen.coordinates as string).match(/\(([^,]+),\s*([^)]+)\)/)
      if (match) {
        latitude = match[1]
        longitude = match[2]
      }
    }
    
    setFormData({
      name: `${screen.name} (Kopija)`,
      city: screen.city,
      district: screen.district,
      address: screen.address,
      latitude: latitude,
      longitude: longitude,
      image_url: screen.image_url,
      mobile_image_url: screen.mobile_image_url || '',
      description: screen.description || '',
      is_double_sided: screen.is_double_sided || false,
      is_video: screen.is_video || false,
      is_static: screen.is_static || false,
      is_viaduct: screen.is_viaduct || false,
      side_a_name: screen.side_a_name || '',
      side_b_name: screen.side_b_name || '',
      side_a_image_url: screen.side_a_image_url || '',
      side_b_image_url: screen.side_b_image_url || '',
      side_a_mobile_image_url: screen.side_a_mobile_image_url || '',
      side_b_mobile_image_url: screen.side_b_mobile_image_url || '',
      size: screen.size || '',
      resolution: screen.resolution || '',
      traffic: screen.traffic || '',
      price: screen.price?.toString() || '',
      is_last_minute: screen.is_last_minute || false,
      last_minute_date: screen.last_minute_date || ''
    })
    setEditingScreen(null) // Nenustatome editingScreen, kad būtų sukurtas naujas ekranas
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Ar tikrai norite ištrinti šį ekraną?')) return

    try {
      const { error } = await supabase
        .from('led_screens')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchScreens()
    } catch (error) {
      console.error('Error deleting screen:', error)
      alert('Klaida trinant ekraną')
    }
  }

  const handleImageUpload = async (file: File, type: 'main' | 'mobile' | 'side_a' | 'side_b') => {
    try {
      setUploading(true)
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        alert('Priimami tik JPG, PNG ir WebP formatai')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Failo dydis negali viršyti 5MB')
        return
      }
      
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('led-screen-images')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('led-screen-images')
        .getPublicUrl(fileName)

      // Update form with new image URL based on type
      setFormData(prev => ({
        ...prev,
        ...(type === 'main' && { image_url: publicUrl }),
        ...(type === 'mobile' && { mobile_image_url: publicUrl }),
        ...(type === 'side_a' && { side_a_image_url: publicUrl }),
        ...(type === 'side_b' && { side_b_image_url: publicUrl })
      }))

      alert('Nuotrauka sėkmingai įkelta!')
      
      // Auto-save screen if editing existing screen
      if (editingScreen) {
        try {
          const currentFormData = {
            ...formData,
            ...(type === 'main' && { image_url: publicUrl }),
            ...(type === 'mobile' && { mobile_image_url: publicUrl }),
            ...(type === 'side_a' && { side_a_image_url: publicUrl }),
            ...(type === 'side_b' && { side_b_image_url: publicUrl })
          }
          
          // Parse coordinates
          const lat = parseFloat(currentFormData.latitude) || 0
          const lng = parseFloat(currentFormData.longitude) || 0
          
          const screenData = {
            name: currentFormData.name,
            city: currentFormData.city,
            district: currentFormData.district,
            address: currentFormData.address,
            coordinates: `${lat},${lng}`,
            image_url: currentFormData.image_url,
            description: currentFormData.description || null,
            is_double_sided: currentFormData.is_double_sided,
            is_video: currentFormData.is_video,
            is_static: currentFormData.is_static,
            is_viaduct: currentFormData.is_viaduct,
            side_a_name: currentFormData.side_a_name || null,
            side_b_name: currentFormData.side_b_name || null,
            side_a_image_url: currentFormData.side_a_image_url || null,
            side_b_image_url: currentFormData.side_b_image_url || null,
            size: currentFormData.size || null,
            resolution: currentFormData.resolution || null,
            traffic: currentFormData.traffic || null,
            price: currentFormData.price ? parseFloat(currentFormData.price) : null,
            is_active: true,
            display_order: screens.length
          }
          
          await supabase
            .from('led_screens')
            .update(screenData)
            .eq('id', editingScreen.id)
            
          console.log('Auto-saved screen with new image')
          alert('Nuotrauka įkelta ir ekranas išsaugotas!')
        } catch (error) {
          console.error('Error auto-saving screen:', error)
        }
      }
    } catch (error: unknown) {
      console.error('Error uploading image:', error)
      alert(`Klaida įkeliant nuotrauką: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Kraunama...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Admin Header with Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
          </svg>
          Atsijungti
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LED Ekranų Valdymas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            + Pridėti Ekraną
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingScreen ? 'Redaguoti Ekraną' : 'Naujas Ekranas'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pavadinimas</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Miestas</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rajonas</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresas</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platuma</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ilguma</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Desktop nuotrauka (1920x1080)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file, 'main')
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Įkeliama...</p>}
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Desktop Preview" className="w-32 h-32 object-cover rounded-lg border" />
                    <p className="text-sm text-green-600 mt-1">Desktop nuotrauka paruošta!</p>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile nuotrauka (1080x1920) - neprivaloma</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file, 'mobile')
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Įkeliama...</p>}
                {formData.mobile_image_url && (
                  <div className="mt-2">
                    <img src={formData.mobile_image_url} alt="Mobile Preview" className="w-32 h-32 object-cover rounded-lg border" />
                    <p className="text-sm text-green-600 mt-1">Mobile nuotrauka paruošta!</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Jei neįkelsite mobile nuotraukos, bus naudojama desktop versija</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Aprašymas</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dydis</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                  placeholder="8x4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Raiška</label>
                <input
                  type="text"
                  value={formData.resolution}
                  onChange={(e) => setFormData({...formData, resolution: e.target.value})}
                  placeholder="1152x576"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Srautas</label>
                <input
                  type="text"
                  value={formData.traffic}
                  onChange={(e) => setFormData({...formData, traffic: e.target.value})}
                  placeholder="300.258"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kaina (EUR)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="70"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="md:col-span-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_last_minute}
                    onChange={(e) => setFormData({...formData, is_last_minute: e.target.checked})}
                    className="mr-2"
                  />
                  Last Minute
                </label>
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Minute data</label>
                <input
                  type="date"
                  value={formData.last_minute_date}
                  onChange={(e) => setFormData({...formData, last_minute_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={!formData.is_last_minute}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_double_sided}
                    onChange={(e) => setFormData({...formData, is_double_sided: e.target.checked})}
                    className="mr-2"
                  />
                  Dvipusis ekranas
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ekrano tipai</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_video}
                      onChange={(e) => setFormData({...formData, is_video: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Video</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_static}
                      onChange={(e) => setFormData({...formData, is_static: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Statinis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_double_sided}
                      onChange={(e) => setFormData({...formData, is_double_sided: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Dvipusis</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_viaduct}
                      onChange={(e) => setFormData({...formData, is_viaduct: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Viadukas</span>
                  </label>
                </div>
              </div>
              {formData.is_double_sided && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Dvipusio ekrano pusės</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pusės A pavadinimas</label>
                      <input
                        type="text"
                        value={formData.side_a_name}
                        onChange={(e) => setFormData({...formData, side_a_name: e.target.value})}
                        placeholder="Ekranas A"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pusės B pavadinimas</label>
                      <input
                        type="text"
                        value={formData.side_b_name}
                        onChange={(e) => setFormData({...formData, side_b_name: e.target.value})}
                        placeholder="Ekranas B"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pusės A nuotrauka</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(file, 'side_a')
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        disabled={uploading}
                      />
                      {formData.side_a_image_url && (
                        <div className="mt-2">
                          <img src={formData.side_a_image_url} alt="Side A Preview" className="w-32 h-32 object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pusės B nuotrauka</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(file, 'side_b')
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        disabled={uploading}
                      />
                      {formData.side_b_image_url && (
                        <div className="mt-2">
                          <img src={formData.side_b_image_url} alt="Side B Preview" className="w-32 h-32 object-cover rounded-lg border" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  {editingScreen ? 'Atnaujinti' : 'Sukurti'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingScreen(null)
                    setFormData({
                      name: '',
                      city: '',
                      district: '',
                      address: '',
                      latitude: '',
                      longitude: '',
                      image_url: '',
                      mobile_image_url: '',
                      description: '',
                      is_double_sided: false,
                      is_video: false,
                      is_static: false,
                      is_viaduct: false,
                      side_a_name: '',
                      side_b_name: '',
                      side_a_image_url: '',
                      side_b_image_url: '',
                      side_a_mobile_image_url: '',
                      side_b_mobile_image_url: '',
                      size: '',
                      resolution: '',
                      traffic: '',
                      price: '',
                      is_last_minute: false,
                      last_minute_date: ''
                    })
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Atšaukti
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('screens')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'screens'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Ekranai ({screens.length})
              </button>
              <button
                onClick={() => setActiveTab('clips')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'clips'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Klipai
              </button>
            </nav>
          </div>
        </div>

        {/* Screens List */}
        {activeTab === 'screens' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Ekranų sąrašas ({screens.length})</h2>
              <p className="text-sm text-gray-600 mt-1">Tempkite eilutes, kad keistumėte ekranų eiliškumą sidebar&apos;e</p>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pavadinimas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miestas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veiksmai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {screens.map((screen) => (
                  <tr 
                    key={screen.id}
                    draggable
                    onDragStart={(e) => handleScreenDragStart(e, screen.id)}
                    onDragOver={handleScreenDragOver}
                    onDrop={(e) => handleScreenDrop(e, screen.id)}
                    className={`cursor-move transition-colors ${
                      draggedScreen === screen.id ? 'bg-blue-50 opacity-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-400 text-sm cursor-move">⋮⋮</div>
                        <div className="text-sm font-medium text-gray-900">{screen.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{screen.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{screen.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {screen.is_video && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Video
                          </span>
                        )}
                        {screen.is_static && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Statinis
                          </span>
                        )}
                        {screen.is_double_sided && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            Dvipusis
                          </span>
                        )}
                        {screen.is_viaduct && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            Viadukas
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(screen)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Redaguoti
                      </button>
                      <button
                        onClick={() => handleCopy(screen)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Kopijuoti
                      </button>
                      <button
                        onClick={() => handleDelete(screen.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Ištrinti
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Clips Tab */}
        {activeTab === 'clips' && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Klipų reikalavimai</h2>
                <p className="text-sm text-gray-600 mt-1">Redaguokite tooltip tekstus ir eiliškumą. Tempkite eilutes, kad keistumėte eiliškumą.</p>
                <p className="text-xs text-blue-600 mt-1">DEBUG: Iš viso eilučių: {clipsData.length}</p>
              </div>
              <button
                onClick={addNewClip}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                + Pridėti eilutę
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {clipsData.map((clip, index) => (
                  <div
                    key={clip.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, clip.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, clip.id)}
                    className={`bg-gray-50 p-4 rounded-lg border-2 transition-all cursor-move ${
                      draggedItem === clip.id ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400 text-sm">⋮⋮</div>
                        <h3 className="font-medium text-gray-900">
                          {clip.city || 'Nauja eilutė'} - {clip.format} ({clip.width}x{clip.height})
                        </h3>
                        <span className="text-xs text-gray-500">ID: {clip.id}</span>
                      </div>
                      <button
                        onClick={() => removeClip(clip.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        🗑️ Ištrinti
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Miestas</label>
                        <input
                          type="text"
                          value={clip.city}
                          onChange={(e) => setClipsData(prev => prev.map(item => 
                            item.id === clip.id ? { ...item, city: e.target.value } : item
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Įveskite miestą"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Formatas</label>
                        <select
                          value={clip.format}
                          onChange={(e) => setClipsData(prev => prev.map(item => 
                            item.id === clip.id ? { ...item, format: e.target.value } : item
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="Horizontalus">Horizontalus</option>
                          <option value="Vertikalus">Vertikalus</option>
                          <option value="Viadukai">Viadukai</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plotis</label>
                        <input
                          type="text"
                          value={clip.width}
                          onChange={(e) => setClipsData(prev => prev.map(item => 
                            item.id === clip.id ? { ...item, width: e.target.value } : item
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Įveskite plotį"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aukštis</label>
                        <input
                          type="text"
                          value={clip.height}
                          onChange={(e) => setClipsData(prev => prev.map(item => 
                            item.id === clip.id ? { ...item, height: e.target.value } : item
                          ))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Įveskite aukštį"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tooltip tekstas</label>
                      <input
                        type="text"
                        value={clip.tooltip}
                        onChange={(e) => handleTooltipChange(clip.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Įveskite ekranų pavadinimus, atskirtus kableliu"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={saveClipsData}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Išsaugoti pakeitimus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
