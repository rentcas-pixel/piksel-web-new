-- Fix slugs to be URL-safe (no spaces, special characters)
UPDATE public.led_screens 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(
                REGEXP_REPLACE(
                  REGEXP_REPLACE(
                    TRIM(slug), -- Remove leading/trailing spaces
                    'ą', 'a', 'g'
                  ),
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
WHERE slug IS NOT NULL;

-- Replace spaces and special characters with hyphens
UPDATE public.led_screens 
SET slug = REGEXP_REPLACE(
  REGEXP_REPLACE(slug, '[^a-z0-9]', '-', 'g'), -- Replace non-alphanumeric with hyphens
  '-+', '-', 'g' -- Replace multiple hyphens with single hyphen
)
WHERE slug IS NOT NULL;

-- Remove trailing hyphens
UPDATE public.led_screens 
SET slug = REGEXP_REPLACE(slug, '-+$', '', 'g')
WHERE slug IS NOT NULL;

-- Remove leading hyphens  
UPDATE public.led_screens 
SET slug = REGEXP_REPLACE(slug, '^-+', '', 'g')
WHERE slug IS NOT NULL;

-- Handle any empty slugs
UPDATE public.led_screens 
SET slug = 'ekranas-' || SUBSTRING(id::TEXT, 1, 8)
WHERE slug IS NULL OR slug = '';
