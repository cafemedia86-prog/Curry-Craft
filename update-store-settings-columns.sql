-- Add expanded contact and social settings to store_settings
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Luxury Heights, Sector 12, Delhi - 110001',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+91 98765 43210',
ADD COLUMN IF NOT EXISTS email TEXT DEFAULT 'royal@currycraft.in',
ADD COLUMN IF NOT EXISTS facebook_url TEXT DEFAULT '#',
ADD COLUMN IF NOT EXISTS instagram_url TEXT DEFAULT '#',
ADD COLUMN IF NOT EXISTS twitter_url TEXT DEFAULT '#',
ADD COLUMN IF NOT EXISTS about_text TEXT DEFAULT 'Experience the royal essence of North Indian and Indian Chinese fusion. We craft every dish with authentic spices and modern love.';

-- Update the existing default row if it exists
UPDATE public.store_settings 
SET 
  address = 'Luxury Heights, Sector 12, Delhi - 110001',
  phone = '+91 98765 43210',
  email = 'royal@currycraft.in',
  about_text = 'Experience the royal essence of North Indian and Indian Chinese fusion. We craft every dish with authentic spices and modern love.'
WHERE id = 1;
