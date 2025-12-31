-- Create favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL, -- MenuItem ID from our menu constant/db
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favorites" 
    ON user_favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
    ON user_favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
    ON user_favorites FOR DELETE 
    USING (auth.uid() = user_id);
