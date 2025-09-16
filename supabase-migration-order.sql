-- Add order column to led_screens table
ALTER TABLE public.led_screens
ADD COLUMN order INTEGER DEFAULT 0;

-- Update existing records to have order based on creation time
-- This will give existing screens a default order
UPDATE public.led_screens 
SET order = EXTRACT(EPOCH FROM created_at)::INTEGER 
WHERE order IS NULL OR order = 0;

-- Create index for better performance when sorting by order
CREATE INDEX IF NOT EXISTS idx_led_screens_order ON public.led_screens(order);

-- Add comment to explain the column
COMMENT ON COLUMN public.led_screens.order IS 'Display order in sidebar - lower numbers appear first';




