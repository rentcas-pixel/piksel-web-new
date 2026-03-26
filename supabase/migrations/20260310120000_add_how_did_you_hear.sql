-- Kaip apie mus sužinojo (optional): screen_in_city | linkedin | google | recommended | NULL

alter table public.inquiries
  add column if not exists how_did_you_hear text;

comment on column public.inquiries.how_did_you_hear is 'Kaip apie mus sužinojo (optional)';
