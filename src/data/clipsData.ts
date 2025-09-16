export interface ClipRequirement {
  id: number;
  city: string;
  format: string;
  width: string;
  height: string;
  tooltip: string;
}

export const defaultClipsData: ClipRequirement[] = [
  { id: 1, city: 'Vilnius', format: 'Viadukai', width: '3040', height: '240', tooltip: 'Konstitucijos, Pedagoginis, Jasinskio' },
  { id: 2, city: 'Vilnius', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Compena, Senukai, Kareivių, Ozo, Pašilaičiai, Ukmergės, Savanorių, Pilaitė, Spaudos rūmai' },
  { id: 3, city: 'Vilnius', format: 'Vertikalus', width: '448', height: '672', tooltip: 'Vilniaus miesto vertikalūs ekranai - ideali vieta didelio formato reklamai' },
  { id: 4, city: 'Vilnius (Outlet)', format: 'Horizontalus', width: '640', height: '288', tooltip: 'Outlet Vilniaus ekranas - aukštos eismo intensyvumo zona prie prekybos centro' },
  { id: 5, city: 'Kaunas ▲', format: 'Horizontalus', width: '1080', height: '450', tooltip: 'Kauno centro ekranas - strateginė vietovė prie pagrindinių gatvių' },
  { id: 6, city: 'Kaunas', format: 'Horizontalus', width: '960', height: '576', tooltip: 'Kauno miesto ekranai - didelio eismo intensyvumo zonos' },
  { id: 7, city: 'Klaipėda', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Klaipėdos miesto ekranai - jūros uosto ir centro zona' },
  { id: 8, city: 'Klaipėda (Centras)', format: 'Vertikalus', width: '720', height: '864', tooltip: 'Klaipėdos centro vertikalus ekranas - aukštos matomumo zona' },
  { id: 9, city: 'Šiauliai', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Šiaulių miesto ekranai - regioninis centras su dideliu eismo intensyvumu' },
  { id: 10, city: 'Panevėžys (RYO/Klaipėdos)', format: 'Horizontalus', width: '1309', height: '576', tooltip: 'Panevėžio RYO/Klaipėdos gatvės ekranas - aukštos eismo intensyvumo zona' },
  { id: 11, city: 'Alytus', format: 'Horizontalus', width: '480', height: '270', tooltip: 'Alytaus miesto ekranas - regioninis centras' },
  { id: 12, city: 'Marijampolė', format: 'Horizontalus', width: '1152', height: '576', tooltip: 'Marijampolės miesto ekranai - svarbus transporto mazgas' },
  { id: 13, city: 'Mažeikiai', format: 'Horizontalus', width: '640', height: '288', tooltip: 'Mažeikių miesto ekranas - regioninis centras' },
  { id: 14, city: 'Utena', format: 'Horizontalus', width: '960', height: '576', tooltip: 'Utenos miesto ekranai - regioninis centras su aukštu eismo intensyvumu' }
];
