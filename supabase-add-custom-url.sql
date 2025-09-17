-- Add custom_url field to led_screens table
-- This will store the full URL path like "vilnius/compensa"

ALTER TABLE public.led_screens 
ADD COLUMN custom_url TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN public.led_screens.custom_url IS 'Custom URL path like "vilnius/compensa" for SEO-friendly URLs';

-- Verify the updated structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'led_screens' 
AND table_schema = 'public'
AND column_name = 'custom_url';
