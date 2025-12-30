import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface NewOrder {
    id: string;
    created_at: string;
    status: string;
    total: number;
    user_id: string;
}

export const useOrderAlerts = (isAdmin: boolean) => {
    const [newOrders, setNewOrders] = useState<NewOrder[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioInterval, setAudioInterval] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isAdmin) return;

        console.log('Setting up order alerts subscription...');

        // Subscribe to new orders
        const subscription = supabase
            .channel('new_orders_alert')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                    filter: 'status=eq.Pending'
                },
                (payload) => {
                    console.log('🔔 New order received!', payload);
                    const newOrder = payload.new as NewOrder;
                    setNewOrders(prev => [...prev, newOrder]);
                    playAlert();
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status);
            });

        return () => {
            console.log('Cleaning up order alerts subscription');
            subscription.unsubscribe();
            stopAlert();
        };
    }, [isAdmin]);

    const playAlert = () => {
        console.log('Playing alert...');
        setIsPlaying(true);

        // Play browser notification sound repeatedly
        const playBeep = () => {
            // Create a simple beep using the Web Audio API
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'square';
                gainNode.gain.value = 0.3;

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);

                // Clean up
                setTimeout(() => {
                    audioContext.close();
                }, 300);
            } catch (err) {
                console.error('Error playing beep:', err);
            }
        };

        // Play immediately
        playBeep();

        // Then play every second
        const interval = setInterval(playBeep, 1000);
        setAudioInterval(interval);
    };

    const stopAlert = () => {
        console.log('Stopping alert...');
        if (audioInterval) {
            clearInterval(audioInterval);
            setAudioInterval(null);
        }
        setIsPlaying(false);
    };

    const dismissOrder = (orderId: string) => {
        console.log('Dismissing order:', orderId);
        setNewOrders(prev => prev.filter(o => o.id !== orderId));
        if (newOrders.length <= 1) {
            stopAlert();
        }
    };

    return {
        newOrders,
        isPlaying,
        dismissOrder,
        stopAlert
    };
};
