-- Add slug column to led_screens table for SEO-friendly URLs
-- This will allow URLs like www.piksel.lt/ekranas/compensa instead of UUID

-- 1. Add slug column
ALTER TABLE public.led_screens 
ADD COLUMN slug VARCHAR(100) UNIQUE;

-- 2. Create function to generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(input_name TEXT) 
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        REGEXP_REPLACE(
            REGEXP_REPLACE(
                REGEXP_REPLACE(input_name, '[ąčęėįšųūž]', 
                    CASE 
                        WHEN input_name ~ 'ą' THEN REPLACE(input_name, 'ą', 'a')
                        WHEN input_name ~ 'č' THEN REPLACE(input_name, 'č', 'c')
                        WHEN input_name ~ 'ę' THEN REPLACE(input_name, 'ę', 'e')
                        WHEN input_name ~ 'ė' THEN REPLACE(input_name, 'ė', 'e')
                        WHEN input_name ~ 'į' THEN REPLACE(input_name, 'į', 'i')
                        WHEN input_name ~ 'š' THEN REPLACE(input_name, 'š', 's')
                        WHEN input_name ~ 'ų' THEN REPLACE(input_name, 'ų', 'u')
                        WHEN input_name ~ 'ū' THEN REPLACE(input_name, 'ū', 'u')
                        WHEN input_name ~ 'ž' THEN REPLACE(input_name, 'ž', 'z')
                        ELSE input_name
                    END
                ),
                '[^a-z0-9\-]', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- 3. Update existing records with generated slugs
UPDATE public.led_screens 
SET slug = (
    CASE 
        WHEN name = 'Compensa' THEN 'compensa'
        WHEN name = 'Senukai' THEN 'senukai' 
        WHEN name = 'Maxima' THEN 'maxima'
        WHEN name = 'Ozas' THEN 'ozas'
        WHEN name = 'Akropolis' THEN 'akropolis'
        WHEN name = 'Panorama' THEN 'panorama'
        WHEN name = 'Mega' THEN 'mega'
        WHEN name = 'IKI' THEN 'iki'
        WHEN name = 'Rimi' THEN 'rimi'
        WHEN name = 'Lidl' THEN 'lidl'
        WHEN name = 'Norfa' THEN 'norfa'
        ELSE LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(
                        REGEXP_REPLACE(
                            REGEXP_REPLACE(
                                REGEXP_REPLACE(
                                    REGEXP_REPLACE(
                                        REGEXP_REPLACE(
                                            REGEXP_REPLACE(name, 'ą', 'a', 'g'),
                                            'č', 'c', 'g'
                                        ),
                                        'ę', 'e', 'g'
                                    ),
                                    'ė', 'e', 'g'
                                ),
                                'į', 'i', 'g'
                            ),
                            'š', 's', 'g'
                        ),
                        'ų', 'u', 'g'
                    ),
                    'ū', 'u', 'g'
                ),
                'ž', 'z', 'g'
            )
        )
    END
)
WHERE slug IS NULL;

-- 4. Handle any remaining NULL slugs with a fallback
UPDATE public.led_screens 
SET slug = 'ekranas-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL OR slug = '';

-- 5. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_led_screens_slug ON public.led_screens(slug);

-- 6. Add constraint to ensure slug is not empty
ALTER TABLE public.led_screens 
ADD CONSTRAINT check_slug_not_empty CHECK (slug IS NOT NULL AND slug != '');

-- 7. Add comment to explain the column
COMMENT ON COLUMN public.led_screens.slug IS 'SEO-friendly URL identifier for screen pages (e.g., compensa, senukai)';

-- 8. Clean up function (optional)
DROP FUNCTION IF EXISTS generate_slug(TEXT);
