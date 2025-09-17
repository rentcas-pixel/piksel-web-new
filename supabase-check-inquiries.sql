-- Check current inquiries table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'inquiries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if table exists and show sample data
SELECT COUNT(*) as total_inquiries FROM public.inquiries;

-- Show sample inquiry if any exist
SELECT * FROM public.inquiries LIMIT 3;
