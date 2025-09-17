-- Add slug column to led_screens table for SEO-friendly URLs (FIXED VERSION)
-- This will allow URLs like www.piksel.lt/ekranas/compensa instead of UUID

-- 1. Add slug column (without UNIQUE constraint initially)
ALTER TABLE public.led_screens 
ADD COLUMN slug VARCHAR(100);

-- 2. Update existing records with unique slugs
-- Add row numbers to make duplicates unique
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

-- 3. Handle duplicates by adding city suffix
WITH duplicates AS (
    SELECT slug, COUNT(*) as count
    FROM public.led_screens 
    WHERE slug IS NOT NULL
    GROUP BY slug 
    HAVING COUNT(*) > 1
),
numbered_rows AS (
    SELECT 
        id,
        slug,
        city,
        ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
    FROM public.led_screens 
    WHERE slug IN (SELECT slug FROM duplicates)
)
UPDATE public.led_screens 
SET slug = CASE 
    WHEN numbered_rows.rn = 1 THEN numbered_rows.slug
    ELSE numbered_rows.slug || '-' || LOWER(numbered_rows.city)
END
FROM numbered_rows 
WHERE public.led_screens.id = numbered_rows.id;

-- 4. Handle any remaining NULL slugs with fallback
UPDATE public.led_screens 
SET slug = 'ekranas-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL OR slug = '';

-- 5. Handle any remaining duplicates with row numbers
WITH remaining_duplicates AS (
    SELECT slug, COUNT(*) as count
    FROM public.led_screens 
    WHERE slug IS NOT NULL
    GROUP BY slug 
    HAVING COUNT(*) > 1
),
numbered_remaining AS (
    SELECT 
        id,
        slug,
        ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
    FROM public.led_screens 
    WHERE slug IN (SELECT slug FROM remaining_duplicates)
)
UPDATE public.led_screens 
SET slug = CASE 
    WHEN numbered_remaining.rn = 1 THEN numbered_remaining.slug
    ELSE numbered_remaining.slug || '-' || numbered_remaining.rn
END
FROM numbered_remaining 
WHERE public.led_screens.id = numbered_remaining.id;

-- 6. Now add UNIQUE constraint
ALTER TABLE public.led_screens 
ADD CONSTRAINT led_screens_slug_unique UNIQUE (slug);

-- 7. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_led_screens_slug ON public.led_screens(slug);

-- 8. Add constraint to ensure slug is not empty
ALTER TABLE public.led_screens 
ADD CONSTRAINT check_slug_not_empty CHECK (slug IS NOT NULL AND slug != '');

-- 9. Add comment to explain the column
COMMENT ON COLUMN public.led_screens.slug IS 'SEO-friendly URL identifier for screen pages (e.g., compensa, senukai-vilnius)';
