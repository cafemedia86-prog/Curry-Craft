import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { MenuItem } from '../types';
import { useMenu } from './MenuContext';

interface FavoritesContextType {
    favorites: string[];
    toggleFavorite: (itemId: string) => Promise<void>;
    isFavorite: (itemId: string) => boolean;
    getFavoriteItems: () => MenuItem[];
    isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { menu } = useMenu();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const fetchFavorites = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_favorites')
                .select('item_id')
                .eq('user_id', user.id);

            if (error) throw error;
            if (data) {
                setFavorites(data.map(f => f.item_id));
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFavorite = async (itemId: string) => {
        if (!user) {
            alert('Please login to favorite items');
            return;
        }

        const isCurrentlyFavorite = favorites.includes(itemId);

        // Optimistic update
        if (isCurrentlyFavorite) {
            setFavorites(prev => prev.filter(id => id !== itemId));
        } else {
            setFavorites(prev => [...prev, itemId]);
        }

        try {
            if (isCurrentlyFavorite) {
                const { error } = await supabase
                    .from('user_favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('item_id', itemId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('user_favorites')
                    .insert([{ user_id: user.id, item_id: itemId }]);
                if (error) throw error;
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Rollback on error
            fetchFavorites();
        }
    };

    const isFavorite = (itemId: string) => favorites.includes(itemId);

    const getFavoriteItems = () => {
        return menu.filter(item => favorites.includes(item.id.toString()));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, getFavoriteItems, isLoading }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
