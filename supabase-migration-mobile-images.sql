-- Supabase migration script to add mobile image fields
-- Run this in Supabase SQL Editor

-- Add mobile image fields to led_screens table
ALTER TABLE led_screens 
ADD COLUMN IF NOT EXISTS mobile_image_url TEXT,
ADD COLUMN IF NOT EXISTS side_a_mobile_image_url TEXT,
ADD COLUMN IF NOT EXISTS side_b_mobile_image_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN led_screens.mobile_image_url IS 'Mobile optimized image URL (1080x1920)';
COMMENT ON COLUMN led_screens.side_a_mobile_image_url IS 'Mobile optimized image URL for side A of double-sided screens';
COMMENT ON COLUMN led_screens.side_b_mobile_image_url IS 'Mobile optimized image URL for side B of double-sided screens';

-- Update existing records to have mobile_image_url = image_url as fallback
UPDATE led_screens 
SET mobile_image_url = image_url 
WHERE mobile_image_url IS NULL;

-- Update existing double-sided screens
UPDATE led_screens 
SET side_a_mobile_image_url = side_a_image_url 
WHERE side_a_mobile_image_url IS NULL AND side_a_image_url IS NOT NULL;

UPDATE led_screens 
SET side_b_mobile_image_url = side_b_image_url 
WHERE side_b_mobile_image_url IS NULL AND side_b_image_url IS NOT NULL;

-- Verify the changes
SELECT 
  id, 
  name, 
  image_url, 
  mobile_image_url,
  side_a_image_url,
  side_a_mobile_image_url,
  side_b_image_url,
  side_b_mobile_image_url
FROM led_screens 
LIMIT 5;

