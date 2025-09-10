'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LEDScreen } from '@/lib/supabase'

export default function AdminPanel() {
  const [screens, setScreens] = useState<LEDScreen[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingScreen, setEditingScreen] = useState<LEDScreen | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    district: '',
    address: '',
    latitude: '',
    longitude: '',
    image_url: '',
    description: '',
    is_double_sided: false,
    is_video: false,
    is_static: false,
    is_viaduct: false,
    side_a_name: '',
    side_b_name: '',
    side_a_image_url: '',
    side_b_image_url: '',
    size: '',
    resolution: '',
    traffic: '',
    price: ''
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchScreens()
  }, [])

  const fetchScreens = async () => {
    try {
      const { data, error } = await supabase
        .from('led_screens')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setScreens(data || [])
    } catch (error) {
      console.error('Error fetching screens:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate coordinates
      const lat = parseFloat(formData.latitude)
      const lng = parseFloat(formData.longitude)
      
      if (isNaN(lat) || isNaN(lng)) {
        alert('Neteisingos koordinatės')
        return
      }

      const screenData = {
        name: formData.name,
        city: formData.city,
        district: formData.district,
        address: formData.address,
        coordinates: `(${lat}, ${lng})`, // POINT format
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
        is_active: true
      }

      console.log('Saving screen data:', screenData)

      if (editingScreen) {
        // Update existing screen
        const { data, error } = await supabase
          .from('led_screens')
          .update(screenData)
          .eq('id', editingScreen.id)
          .select()

        if (error) {
          console.error('Update error:', error)
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
        description: '',
        is_double_sided: false,
        is_video: true,
        is_static: false,
        is_viaduct: false,
        side_a_name: '',
        side_b_name: '',
        side_a_image_url: '',
        side_b_image_url: '',
        size: '',
        resolution: '',
        traffic: '',
        price: ''
      })
      setShowForm(false)
      setEditingScreen(null)
      fetchScreens()
    } catch (error: unknown) {
      console.error('Error saving screen:', error)
      alert(`Klaida išsaugant ekraną: ${error instanceof Error ? error.message : 'Nežinoma klaida'}`)
    }
  }

  const handleEdit = (screen: LEDScreen) => {
    console.log('Editing screen coordinates:', screen.coordinates, typeof screen.coordinates)
    
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
      image_url: screen.image_url,
      description: screen.description || '',
      is_double_sided: screen.is_double_sided || false,
      is_video: screen.is_video || false,
      is_static: screen.is_static || false,
      is_viaduct: screen.is_viaduct || false,
      side_a_name: screen.side_a_name || '',
      side_b_name: screen.side_b_name || '',
      side_a_image_url: screen.side_a_image_url || '',
      side_b_image_url: screen.side_b_image_url || '',
      size: screen.size || '',
      resolution: screen.resolution || '',
      traffic: screen.traffic || '',
      price: screen.price?.toString() || ''
    })
    setEditingScreen(screen)
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

  const handleImageUpload = async (file: File, type: 'main' | 'side_a' | 'side_b' = 'main') => {
    try {
      setUploading(true)
      
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
        ...(type === 'side_a' && { side_a_image_url: publicUrl }),
        ...(type === 'side_b' && { side_b_image_url: publicUrl })
      }))

      alert('Nuotrauka sėkmingai įkelta!')
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Įkelkite nuotrauką</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Įkeliama...</p>}
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded-lg border" />
                    <p className="text-sm text-green-600 mt-1">Nuotrauka paruošta!</p>
                  </div>
                )}
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
                      description: '',
                      is_double_sided: false,
                      is_video: false,
                      is_static: false,
                      is_viaduct: false,
                      side_a_name: '',
                      side_b_name: '',
                      side_a_image_url: '',
                      side_b_image_url: '',
                      size: '',
                      resolution: '',
                      traffic: '',
                      price: ''
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

        {/* Screens List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Ekranų sąrašas ({screens.length})</h2>
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
                  <tr key={screen.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{screen.name}</div>
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
      </div>
    </div>
  )
}
