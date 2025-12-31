import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ViewCartPopup: React.FC = () => {
    const { cartCount, cartTotal, setIsCartOpen, isCartOpen } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const [lastCount, setLastCount] = useState(0);

    useEffect(() => {
        if (cartCount > 0) {
            // Logic: Show if count increased
            if (cartCount > lastCount) {
                setIsVisible(true);
            }
            setLastCount(cartCount);
        } else {
            setIsVisible(false);
            setLastCount(0);
        }
    }, [cartCount, lastCount]);

    // Added isCartOpen check to hide when cart is active
    if (!isVisible || cartCount === 0 || isCartOpen) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[90] animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-[#0F2E1A] text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-[#D4A017]/30">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ShoppingBag className="text-[#D4A017]" size={24} />
                        <span className="absolute -top-1 -right-1 bg-[#D4A017] text-[#0F2E1A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm font-bold">{cartCount} {cartCount === 1 ? 'Item' : 'Items'} Added</div>
                        <div className="text-[10px] text-[#FAF7F0]/60 uppercase tracking-widest">Total: ₹{cartTotal}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-[#D4A017] text-[#0F2E1A] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-[#F4C430] transition-colors active:scale-95"
                    >
                        View Cart <ChevronRight size={14} />
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 text-[#FAF7F0]/40 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewCartPopup;
