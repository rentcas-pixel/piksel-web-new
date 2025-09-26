-- Add last minute columns to led_screens table
ALTER TABLE led_screens 
ADD COLUMN IF NOT EXISTS is_last_minute BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_minute_date DATE;

-- Add comments for documentation
COMMENT ON COLUMN led_screens.is_last_minute IS 'Indicates if this screen has last minute pricing';
COMMENT ON COLUMN led_screens.last_minute_date IS 'Date until which last minute pricing is valid';
