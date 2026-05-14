-- Neprivaloma techninės schemos / diagramos nuoroda konkrečiam klipų eilutės įrašui (pvz. Akropolis 3 pusės)
alter table public.clip_screens
  add column if not exists spec_diagram_url text;

comment on column public.clip_screens.spec_diagram_url is 'Viešas paveikslėlio ar PDF URL; puslapiuose /klipai rodoma Info ikona šalia ekrano pavadinimo (modalas).';
