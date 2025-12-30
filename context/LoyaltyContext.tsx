
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Tier {
    name: string;
    minPoints: number;
    multiplier: number;
}

export interface LoyaltySettings {
    points_per_rupee: number;
    min_redemption_points: number;
    redemption_rate: number; // How much ₹ value per point (1.0 = 1:1, 0.1 = 100 points = ₹10)
    tiers: Tier[];
}

interface LoyaltyContextType {
    settings: LoyaltySettings | null;
    isLoading: boolean;
    updateSettings: (newSettings: Partial<LoyaltySettings>) => Promise<void>;
    calculatePointsToAward: (orderTotal: number) => number;
    getTier: (currentPoints: number) => Tier;
    nextTier: (currentPoints: number) => Tier | null;
}

const defaultSettings: LoyaltySettings = {
    points_per_rupee: 0.1,
    min_redemption_points: 100,
    redemption_rate: 1.0,
    tiers: [
        { name: 'Bronze', minPoints: 0, multiplier: 1 },
        { name: 'Silver', minPoints: 500, multiplier: 1.1 },
        { name: 'Gold', minPoints: 2000, multiplier: 1.25 }
    ]
};

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<LoyaltySettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('loyalty_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (data) {
                setSettings({
                    points_per_rupee: data.points_per_rupee,
                    min_redemption_points: data.min_redemption_points,
                    redemption_rate: data.redemption_rate || 1.0,
                    tiers: typeof data.tiers === 'string' ? JSON.parse(data.tiers) : data.tiers
                });
            } else if (error && error.code === 'PGRST116') {
                // No settings found, maybe insert them?
                console.log('Using default loyalty settings');
                // Optional: Insert default settings here if we want auto-init
            }
        } catch (err) {
            console.error('Error fetching loyalty settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();

        // Subscribe to changes
        const subscription = supabase
            .channel('loyalty_settings_changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'loyalty_settings', filter: 'id=eq.1' },
                (payload) => {
                    const newData = payload.new;
                    setSettings({
                        points_per_rupee: newData.points_per_rupee,
                        min_redemption_points: newData.min_redemption_points,
                        redemption_rate: newData.redemption_rate || 1.0,
                        tiers: typeof newData.tiers === 'string' ? JSON.parse(newData.tiers) : newData.tiers
                    });
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const updateSettings = async (newSettings: Partial<LoyaltySettings>) => {
        const updated = { ...settings, ...newSettings };
        const { error } = await supabase
            .from('loyalty_settings')
            .upsert({
                id: 1,
                points_per_rupee: updated.points_per_rupee,
                min_redemption_points: updated.min_redemption_points,
                redemption_rate: updated.redemption_rate,
                tiers: updated.tiers
            });

        if (error) throw error;
        setSettings(updated);
    };

    const calculatePointsToAward = (orderTotal: number) => {
        return Math.floor(orderTotal * settings.points_per_rupee);
    };

    const getTier = (currentPoints: number) => {
        // Sort tiers by minPoints descending to find the highest matching one
        const sorted = [...settings.tiers].sort((a, b) => b.minPoints - a.minPoints);
        return sorted.find(t => currentPoints >= t.minPoints) || settings.tiers[0];
    };

    const nextTier = (currentPoints: number) => {
        const sorted = [...settings.tiers].sort((a, b) => a.minPoints - b.minPoints);
        return sorted.find(t => t.minPoints > currentPoints) || null;
    };

    return (
        <LoyaltyContext.Provider value={{ settings, isLoading, updateSettings, calculatePointsToAward, getTier, nextTier }}>
            {children}
        </LoyaltyContext.Provider>
    );
};

export const useLoyalty = () => {
    const context = useContext(LoyaltyContext);
    if (context === undefined) {
        throw new Error('useLoyalty must be used within a LoyaltyProvider');
    }
    return context;
};
