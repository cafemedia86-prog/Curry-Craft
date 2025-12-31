import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';

interface QuantitySelectorProps {
    item: MenuItem;
    size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ item, size = 'md' }) => {
    const { items, addToCart, updateQuantity } = useCart();
    const cartItem = items.find(i => i.id === item.id);

    if (!cartItem) {
        return (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                }}
                className={`${size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'} bg-[#0F2E1A] rounded-full flex items-center justify-center text-white hover:bg-[#D4A017] transition-all shadow-lg shadow-[#0F2E1A]/10 active:scale-90`}
            >
                <Plus size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} />
            </button>
        );
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-3 bg-[#0F2E1A] text-white rounded-full ${size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5'} shadow-lg shadow-[#0F2E1A]/10 animate-in zoom-in-95 duration-200`}
        >
            <button
                onClick={() => updateQuantity(item.id, -1)}
                className="hover:text-[#D4A017] transition-colors p-0.5"
            >
                <Minus size={size === 'sm' ? 12 : 16} strokeWidth={3} />
            </button>
            <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-bold min-w-[12px] text-center`}>
                {cartItem.quantity}
            </span>
            <button
                onClick={() => updateQuantity(item.id, 1)}
                className="hover:text-[#D4A017] transition-colors p-0.5"
            >
                <Plus size={size === 'sm' ? 12 : 16} strokeWidth={3} />
            </button>
        </div>
    );
};

export default QuantitySelector;
