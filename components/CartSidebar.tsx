import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSidebar: React.FC = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-green-950 border-l border-green-800 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-green-800 flex justify-between items-center bg-green-900/50">
          <h2 className="text-xl font-serif text-amber-400">Your Order</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-green-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-green-400 opacity-60">
              <div className="w-16 h-16 border-2 border-green-700 rounded-full flex items-center justify-center mb-4 text-2xl font-serif">0</div>
              <p>Your cart is empty.</p>
              <p className="text-sm mt-2">Add some royal delicacies!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-green-900 rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-green-700 text-xs font-serif">DDH</div>
                    )}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-green-50 font-medium text-sm">{item.name}</h4>
                  <div className="text-amber-500 font-bold text-sm mt-1">₹ {item.price * item.quantity}</div>
                </div>

                <div className="flex items-center gap-3 bg-green-900 rounded-full px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-amber-400 text-green-300"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-amber-400 text-green-300"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-green-900/50 border-t border-green-800">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-green-300 text-sm">
                <span>Subtotal</span>
                <span>₹ {cartTotal}</span>
              </div>
              <div className="flex justify-between text-green-300 text-sm">
                <span>Taxes (5%)</span>
                <span>₹ {Math.round(cartTotal * 0.05)}</span>
              </div>
              <div className="flex justify-between text-amber-400 font-serif font-bold text-lg pt-2 border-t border-green-800 mt-2">
                <span>Total</span>
                <span>₹ {cartTotal + Math.round(cartTotal * 0.05)}</span>
              </div>
            </div>
            
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white font-serif py-3 rounded-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-colors">
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
