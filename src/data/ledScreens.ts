export interface LEDScreen {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  city: string;
  district: string;
  address: string;
  image: string;
  description?: string;
  lastMinute?: boolean;
  lastMinuteDate?: string;
  isDoubleSided?: boolean;
  contentType?: 'video' | 'static'; // 'video' arba 'static'
}

export const ledScreens: LEDScreen[] = [
  // Vilnius
  {
    id: 'vilnius-1',
    name: 'Compensa',
    coordinates: [54.71278995399607, 25.277868551981598],
    city: 'Vilnius',
    district: 'Centras',
    address: 'Ozo ir Kernvės g. sankirta',
    image: '/foto/Compensa.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-08-25',
    isDoubleSided: true,
    contentType: 'video'
  },
  {
    id: 'vilnius-2',
    name: 'Senukai',
    coordinates: [54.72443843960206, 25.241842369519183],
    city: 'Vilnius',
    district: 'Žirmūnai',
    address: 'Ukmergės g. 248',
    image: '/foto/Ukemrges.jpg',
    contentType: 'static'
  },
  {
    id: 'vilnius-3',
    name: 'Maxima',
    coordinates: [54.6892, 25.2798],
    city: 'Vilnius',
    district: 'Senamiestis',
    address: 'Gedimino pr. 1',
    image: '/foto/Kareiviu.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-08-30',
    contentType: 'video'
  },
  {
    id: 'vilnius-4',
    name: 'Akropolis',
    coordinates: [54.6732, 25.2845],
    city: 'Vilnius',
    district: 'Naujamiestis',
    address: 'Ozo g. 25',
    image: '/foto/Ozas.jpg',
    contentType: 'static'
  },
  {
    id: 'vilnius-5',
    name: 'Europa',
    coordinates: [54.6969, 25.2876],
    city: 'Vilnius',
    district: 'Antakalnis',
    address: 'Konstitucijos pr. 7',
    image: '/foto/Pasilaiciai.jpg',
    contentType: 'static'
  },

  // Kaunas
  {
    id: 'kaunas-1',
    name: 'Mega',
    coordinates: [54.8985, 23.9036],
    city: 'Kaunas',
    district: 'Centras',
    address: 'Laisvės al. 66',
    image: '/Compensa.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-09-05',
    isDoubleSided: true,
    contentType: 'video'
  },
  {
    id: 'kaunas-2',
    name: 'Akropolis Kaunas',
    coordinates: [54.9123, 23.9156],
    city: 'Kaunas',
    district: 'Šilainiai',
    address: 'Ozo g. 18',
    image: '/Senukai.jpg',
    contentType: 'static'
  },
  {
    id: 'kaunas-3',
    name: 'Urmas',
    coordinates: [54.8892, 23.8967],
    city: 'Kaunas',
    district: 'Senamiestis',
    address: 'Laisvės al. 25',
    image: '/Compensa.jpg',
    contentType: 'video'
  },

  // Klaipėda
  {
    id: 'klaipeda-1',
    name: 'Akropolis Klaipėda',
    coordinates: [55.7033, 21.1443],
    city: 'Klaipėda',
    district: 'Centras',
    address: 'Taikos pr. 61',
    image: '/Senukai.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-09-10',
    isDoubleSided: true,
    contentType: 'static'
  },
  {
    id: 'klaipeda-2',
    name: 'Mega Klaipėda',
    coordinates: [55.7123, 21.1567],
    city: 'Klaipėda',
    district: 'Melnragė',
    address: 'Taikos pr. 95',
    image: '/Compensa.jpg',
    contentType: 'video'
  },

  // Šiauliai
  {
    id: 'siauliai-1',
    name: 'Akropolis Šiauliai',
    coordinates: [55.9342, 23.3167],
    city: 'Šiauliai',
    district: 'Centras',
    address: 'Vilniaus g. 141',
    image: '/Senukai.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-09-15',
    contentType: 'static'
  },
  {
    id: 'siauliai-2',
    name: 'Mega Šiauliai',
    coordinates: [55.9456, 23.3234],
    city: 'Šiauliai',
    district: 'Rūdaičiai',
    address: 'Vilniaus g. 185',
    image: '/Compensa.jpg',
    contentType: 'video'
  },

  // Panevėžys
  {
    id: 'panevezys-1',
    name: 'Akropolis Panevėžys',
    coordinates: [55.7372, 24.3545],
    city: 'Panevėžys',
    district: 'Centras',
    address: 'Respublikos g. 40',
    image: '/Compensa.jpg',
    lastMinute: true,
    lastMinuteDate: '2025-09-20',
    contentType: 'static'
  },
  {
    id: 'panevezys-2',
    name: 'Mega Panevėžys',
    coordinates: [55.7456, 24.3678],
    city: 'Panevėžys',
    district: 'Senamiestis',
    address: 'Respublikos g. 75',
    image: '/Senukai.jpg',
    contentType: 'video'
  }
];