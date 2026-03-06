export interface ClipRequirement {
  id: number;
  city: string;
  format: string;
  width: string;
  height: string;
  tooltip: string;
}

/** Excel struktūra: Miestas, Ekranas, Tipas, Rezoliucija */
export interface ClipScreen {
  id: number;
  city: string;
  screen: string;
  type: string;
  resolution: string;
}

/** Reklaminiai ekranai: Miestas, Vieta, Tipas (Statinis/Video), Rezoliucija */
export const clipScreensFromExcel: ClipScreen[] = [
  { id: 1, city: 'Vilnius', screen: 'Viadukai', type: 'Statinis', resolution: '3040x240' },
  { id: 2, city: 'Vilnius', screen: 'Compensa', type: 'Video', resolution: '1152x576' },
  { id: 3, city: 'Vilnius', screen: 'Senukai', type: 'Video', resolution: '1152x576' },
  { id: 4, city: 'Vilnius', screen: 'Kareivių', type: 'Statinis', resolution: '1152x576' },
  { id: 5, city: 'Vilnius', screen: 'Ozo', type: 'Statinis', resolution: '1152x576' },
  { id: 6, city: 'Vilnius', screen: 'Ukmergės', type: 'Statinis', resolution: '1152x576' },
  { id: 7, city: 'Vilnius', screen: 'Pašilaičiai', type: 'Statinis', resolution: '1152x576' },
  { id: 8, city: 'Vilnius', screen: 'Pilaitė', type: 'Statinis', resolution: '1152x576' },
  { id: 9, city: 'Vilnius', screen: 'Spaudos rūmai', type: 'Statinis', resolution: '1152x576' },
  { id: 10, city: 'Vilnius', screen: 'Savanorių', type: 'Video', resolution: '1152x576' },
  { id: 11, city: 'Vilnius', screen: 'Kalvarijų', type: 'Video', resolution: '448x672' },
  { id: 12, city: 'Vilnius', screen: 'Nordika', type: 'Video', resolution: '448x672' },
  { id: 13, city: 'Vilnius', screen: 'Outlet', type: 'Video', resolution: '960x432' },
  { id: 14, city: 'Kaunas', screen: 'Urmas', type: 'Video', resolution: '1080x450' },
  { id: 15, city: 'Kaunas', screen: 'Urmas', type: 'Video', resolution: '1080x450' },
  { id: 16, city: 'Kaunas', screen: 'Pramonės', type: 'Video', resolution: '860x360' },
  { id: 17, city: 'Kaunas', screen: 'Girstučio', type: 'Video', resolution: '860x360' },
  { id: 18, city: 'Kaunas', screen: 'Molas', type: 'Video', resolution: '860x360' },
  { id: 19, city: 'Kaunas', screen: 'Centras', type: 'Video', resolution: '960x576' },
  { id: 20, city: 'Kaunas', screen: 'Centras', type: 'Video', resolution: '960x576' },
  { id: 21, city: 'Kaunas', screen: 'Vytauto pr.', type: 'Video', resolution: '960x576' },
  { id: 22, city: 'Kaunas', screen: 'Iš Senamiesčio', type: 'Video', resolution: '800x360' },
  { id: 23, city: 'Kaunas', screen: 'Į Senamiestį', type: 'Video', resolution: '800x360' },
  { id: 24, city: 'Klaipėda', screen: 'Baltijos', type: 'Video', resolution: '1152x576' },
  { id: 25, city: 'Klaipėda', screen: 'Šilutės', type: 'Video', resolution: '1152x576' },
  { id: 26, city: 'Klaipėda', screen: 'Centras', type: 'Video', resolution: '720x864' },
  { id: 27, city: 'Šiauliai', screen: 'Dubijos', type: 'Video', resolution: '1152x576' },
  { id: 28, city: 'Šiauliai', screen: 'Rūta', type: 'Video', resolution: '1152x576' },
  { id: 29, city: 'Panevėžys', screen: 'RYO', type: 'Video', resolution: '1309x576' },
  { id: 30, city: 'Panevėžys', screen: 'Vilniaus', type: 'Video', resolution: '576x288' },
  { id: 31, city: 'Panevėžys', screen: 'Klaipėdos', type: 'Video', resolution: '1309x576' },
  { id: 32, city: 'Panevėžys', screen: 'Centras', type: 'Video', resolution: '1152x576' },
  { id: 33, city: 'Panevėžys', screen: 'Maxima', type: 'Video', resolution: '1152x576' },
  { id: 34, city: 'Mažeikiai', screen: 'Mažeikiai', type: 'Video', resolution: '640x288' },
  { id: 35, city: 'Alytus', screen: 'Alytus', type: 'Video', resolution: '480x270' },
  { id: 36, city: 'Marijampolė', screen: 'Marijampolė', type: 'Video', resolution: '1152x576' },
  { id: 37, city: 'Utena', screen: 'Utena', type: 'Video', resolution: '960x576' },
  { id: 38, city: 'Jonava', screen: 'Jonava', type: 'Video', resolution: '768x384' },
  { id: 39, city: 'Tauragė', screen: 'Tauragė', type: 'Video', resolution: '840x360' },
  { id: 40, city: 'Joniškis', screen: 'Joniškis', type: 'Video', resolution: '720x480' },
];

export const defaultClipsData: ClipRequirement[] = [
  { id: 1, city: 'Vilnius', format: 'Viadukai', width: '3040', height: '240', tooltip: 'Konstitucijos, Pedagoginis, Jasinskio' },
  { id: 2, city: 'Vilnius', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Compensa, Senukai, Kareivių, Ozo, Pašilaičiai, Ukmergės, Savanorių, Pilaitė, Spaudos rūmai' },
  { id: 3, city: 'Vilnius', format: 'Vertikalus', width: '448', height: '672', tooltip: 'Vilniaus miesto vertikalūs ekranai' },
  { id: 4, city: 'Vilnius (Outlet)', format: 'Horizontalus', width: '640', height: '288', tooltip: 'Outlet Vilniaus ekranas' },
  { id: 5, city: 'Kaunas ▲', format: 'Horizontalus', width: '1080', height: '450', tooltip: 'Kauno centro ekranas' },
  { id: 6, city: 'Kaunas', format: 'Horizontalus', width: '960', height: '576', tooltip: 'Kauno miesto ekranai' },
  { id: 7, city: 'Klaipėda', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Klaipėdos miesto ekranai' },
  { id: 8, city: 'Klaipėda (Centras)', format: 'Vertikalus', width: '720', height: '864', tooltip: 'Klaipėdos centro vertikalus ekranas' },
  { id: 9, city: 'Šiauliai', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Šiaulių miesto ekranai' },
  { id: 10, city: 'Panevėžys (RYO/Klaipėdos)', format: 'Horizontalus', width: '1309', height: '576', tooltip: 'Panevėžio RYO/Klaipėdos gatvės ekranas' },
  { id: 11, city: 'Alytus', format: 'Horizontalus', width: '480', height: '270', tooltip: 'Alytaus miesto ekranas' },
  { id: 12, city: 'Marijampolė', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Marijampolės miesto ekranai' },
  { id: 13, city: 'Mažeikiai', format: 'Horizontalus', width: '640', height: '288', tooltip: 'Mažeikių miesto ekranas' },
  { id: 14, city: 'Utena', format: 'Horizontalus', width: '960', height: '576', tooltip: 'Utenos miesto ekranai' }
];
