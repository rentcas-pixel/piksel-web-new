import { supabase } from './src/lib/supabase'
import { ledScreens } from './src/data/ledScreens'

async function migrateData() {
  console.log('🚀 Pradedamas duomenų perkėlimas...')
  
  try {
    // Perkelti LED screens
    for (const screen of ledScreens) {
      console.log(`📱 Perkeliamas ekranas: ${screen.name}`)
      
      const { data, error } = await supabase
        .from('led_screens')
        .insert([
          {
            name: screen.name,
            coordinates: `(${screen.coordinates[0]}, ${screen.coordinates[1]})`, // POINT format
            city: screen.city,
            district: screen.district,
            address: screen.address,
            image_url: screen.image, // Laikinai naudojame local path
            description: screen.description,
            is_double_sided: screen.isDoubleSided || false,
            content_type: screen.contentType || 'video',
            is_active: true
          }
        ])
        .select()

      if (error) {
        console.error(`❌ Klaida su ${screen.name}:`, error)
      } else {
        console.log(`✅ Sėkmingai perkeltas: ${screen.name}`)
        
        // Pridėti kainas (jei reikia)
        if (data && data[0]) {
          const screenId = data[0].id
          
          // Standartinės kainos (galite keisti)
          const prices = [
            { duration_days: 1, price_euros: 50.00 },
            { duration_days: 7, price_euros: 300.00 },
            { duration_days: 30, price_euros: 1000.00 }
          ]
          
          for (const price of prices) {
            await supabase
              .from('pricing')
              .insert([
                {
                  screen_id: screenId,
                  duration_days: price.duration_days,
                  price_euros: price.price_euros,
                  is_last_minute: false
                }
              ])
          }
          
          // Last minute kaina (jei yra)
          if (screen.lastMinute) {
            await supabase
              .from('pricing')
              .insert([
                {
                  screen_id: screenId,
                  duration_days: 1,
                  price_euros: 25.00, // Puse kainos
                  is_last_minute: true,
                  last_minute_date: screen.lastMinuteDate || '2025-08-25'
                }
              ])
          }
        }
      }
    }
    
    console.log('🎉 Duomenų perkėlimas baigtas!')
    
  } catch (error) {
    console.error('💥 Klaida:', error)
  }
}

// Paleisti perkėlimą
migrateData()



