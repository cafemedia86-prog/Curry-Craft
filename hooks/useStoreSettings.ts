import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface StoreSettings {
    id: number;
    outlet_name: string;
    outlet_latitude: number;
    outlet_longitude: number;
    address: string;
    phone: string;
    email: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    about_text: string;
}

export const useStoreSettings = () => {
    const [settings, setSettings] = useState<StoreSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .single(); // Assuming single row

            if (error) {
                // If table is empty or error, use defaults (though SQL script inserts row)
                if (error.code === 'PGRST116') { // JSON object requested, multiple (or no) rows returned
                    // Handle empty case if needed, but we expect 1 row
                }
                console.error('Error fetching settings:', error);
            } else {
                setSettings(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (updates: Partial<StoreSettings>) => {
        try {
            const { error } = await supabase
                .from('store_settings')
                .update(updates)
                .gt('id', 0);

            if (error) throw error;
            await fetchSettings();
            return { success: true };
        } catch (error) {
            console.error('Error updating settings:', error);
            return { success: false, error };
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, updateSettings, refetch: fetchSettings };
};
