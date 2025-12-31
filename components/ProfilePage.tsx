import React, { useState, useEffect } from 'react';
import { Clock, Heart, MapPin, Award, Settings, ArrowLeft, LogOut, Wallet, ChevronRight, Plus, Star, Trash2 } from 'lucide-react';
import OrderHistory from './OrderHistory';
import AddressManager from './AddressManager';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { MenuItem } from '../types';
import QuantitySelector from './QuantitySelector';

interface ProfilePageProps {
    onProductClick?: (product: MenuItem) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onProductClick }) => {
    const { user, logout } = useAuth();
    const { getFavoriteItems, toggleFavorite, isFavorite } = useFavorites();
    const { addToCart } = useCart();
    const [activeSection, setActiveSection] = useState<'main' | 'orders' | 'loyalty' | 'addresses' | 'favorites' | 'settings'>('main');

    if (!user) {
        return (
            <div className="p-10 text-center text-[#0F2E1A]/40 font-bold uppercase tracking-widest text-xs animate-pulse">
                Loading royal profile...
            </div>
        );
    }

    const userName = user.name || 'Royal Guest';
    const initials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

    const BackButton = () => (
        <button
            onClick={() => setActiveSection('main')}
            className="flex items-center gap-2 text-[#D4A017] mb-8 hover:text-[#F4C430] transition-colors p-2 bg-[#0F2E1A] rounded-full shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
            <ArrowLeft size={20} />
        </button>
    );

    if (activeSection === 'orders') {
        return (
            <div className="p-6 animate-in slide-in-from-right duration-300">
                <BackButton />
                <h2 className="text-3xl font-serif font-bold text-[#0F2E1A] mb-8">Order History</h2>
                <OrderHistory />
            </div>
        );
    }

    if (activeSection === 'addresses') {
        return (
            <div className="p-6 animate-in slide-in-from-right duration-300">
                <BackButton />
                <AddressManager />
            </div>
        );
    }

    if (activeSection === 'loyalty') {
        return (
            <div className="p-6 animate-in slide-in-from-right duration-300">
                <BackButton />
                <div className="bg-[#0F2E1A] p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4A017]/10 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-[#D4A017]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award className="text-[#D4A017]" size={40} />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-2">Loyalty Points</h3>
                        <div className="text-6xl font-sans font-bold text-[#D4A017] mb-6 drop-shadow-lg">{user.loyaltyPoints}</div>
                        <p className="text-[#FAF7F0]/60 text-sm mb-8 font-medium">Earn more points by ordering your favorite dishes.</p>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] text-left border border-white/10">
                            <div className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest mb-2">Your Benefit</div>
                            <div className="text-[#FAF7F0] font-medium leading-relaxed">Gold Tier Status: Enjoy <span className="text-[#D4A017] font-bold">1.25x Points</span> on every royal feast you order.</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (activeSection === 'favorites') {
        const favoriteItems = getFavoriteItems();
        return (
            <div className="p-6 animate-in slide-in-from-right duration-300">
                <BackButton />
                <h2 className="text-3xl font-serif font-bold text-[#0F2E1A] mb-8">My Favorites</h2>

                {favoriteItems.length === 0 ? (
                    <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-[#E6E0D5] text-center">
                        <Heart size={48} className="text-[#D4A017]/20 mx-auto mb-4" />
                        <p className="text-[#0F2E1A]/40 font-medium font-serif italic">Your favorite dishes will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {favoriteItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => onProductClick?.(item)}
                                className="bg-white rounded-3xl p-3 flex gap-4 shadow-sm border border-[#E6E0D5] hover:border-[#D4A017]/30 transition-all cursor-pointer group"
                            >
                                <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className={`w-2.5 h-2.5 border ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center p-[1px]`}>
                                                <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            </div>
                                            <h4 className="text-[#0F2E1A] font-serif text-lg font-bold line-clamp-1">{item.name}</h4>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star className="fill-[#D4A017] text-[#D4A017]" size={10} />
                                            <span className="text-[#0F2E1A]/60 text-[10px] font-bold">{item.rating || '4.5'}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#D4A017] font-bold">₹{item.price}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(item.id.toString());
                                                }}
                                                className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                                title="Remove from favorites"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <QuantitySelector item={item} size="sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (activeSection === 'settings') {
        return (
            <div className="p-6 animate-in slide-in-from-right duration-300">
                <BackButton />
                <h2 className="text-3xl font-serif font-bold text-[#0F2E1A] mb-8">Account Settings</h2>
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-[2rem] border border-[#E6E0D5]">
                        <label className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest block mb-2 px-1">Full Name</label>
                        <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full bg-[#F5F1E8] border border-[#E6E0D5] rounded-2xl px-5 py-4 text-[#0F2E1A] font-bold focus:outline-none focus:border-[#D4A017] transition-colors"
                        />
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-[#E6E0D5]">
                        <label className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest block mb-2 px-1">Email Address</label>
                        <input
                            type="email"
                            disabled
                            defaultValue={user.email}
                            className="w-full bg-[#F5F1E8] border border-[#E6E0D5] rounded-2xl px-5 py-4 text-[#0F2E1A]/40 font-bold"
                        />
                    </div>
                    <button className="w-full bg-[#0F2E1A] text-[#D4A017] font-bold py-5 rounded-[2rem] shadow-xl shadow-[#0F2E1A]/20 transition-all active:scale-95 mt-4">
                        Save Changes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 animate-in slide-in-from-right duration-300">
            {/* User Profile Header */}
            <div className="flex items-center gap-5 mb-10">
                <div className="w-24 h-24 bg-[#0F2E1A] rounded-full flex items-center justify-center text-[#D4A017] text-3xl font-serif font-bold shadow-xl border-4 border-white">
                    {initials}
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#0F2E1A] mb-1">{userName}</h2>
                    <div className="bg-[#D4A017]/10 text-[#D4A017] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block">
                        {user.role === 'ADMIN' ? 'Royal Administrator' :
                            user.role === 'MANAGER' ? 'Store Manager' : 'Gold Member'}
                    </div>
                </div>
            </div>

            {user.role === 'USER' && (
                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="bg-[#0F2E1A] p-5 rounded-[2rem] shadow-lg shadow-[#0F2E1A]/10 border border-[#D4A017]/10">
                        <div className="text-[#FAF7F0]/40 text-[10px] uppercase font-bold tracking-[0.15em] mb-2 flex items-center gap-1">
                            <Wallet size={12} className="text-[#D4A017]" /> Wallet
                        </div>
                        <div className="text-[#FAF7F0] font-sans font-bold text-xl">
                            ₹{user.walletBalance.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="bg-[#0F2E1A] p-5 rounded-[2rem] shadow-lg shadow-[#0F2E1A]/10 border border-[#D4A017]/10">
                        <div className="text-[#FAF7F0]/40 text-[10px] uppercase font-bold tracking-[0.15em] mb-2 flex items-center gap-1">
                            <Award size={12} className="text-[#D4A017]" /> Loyalty
                        </div>
                        <div className="text-[#FAF7F0] font-sans font-bold text-xl">
                            {user.loyaltyPoints.toLocaleString()} <span className="text-[10px] text-[#D4A017]/60">pts</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {[
                    { icon: <Clock size={20} />, label: 'Order History', id: 'orders', hide: user.role === 'ADMIN' },
                    { icon: <Award size={20} />, label: 'Loyalty Points', id: 'loyalty', hide: user.role === 'ADMIN' },
                    { icon: <Heart size={20} />, label: 'Favorites', id: 'favorites', hide: user.role === 'ADMIN' },
                    { icon: <MapPin size={20} />, label: 'Saved Addresses', id: 'addresses', hide: user.role === 'ADMIN' },
                    { icon: <Settings size={20} />, label: 'Settings', id: 'settings' },
                ].filter(i => !i.hide).map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            if (item.id === 'orders') setActiveSection('orders');
                            if (item.id === 'loyalty') setActiveSection('loyalty');
                            if (item.id === 'addresses') setActiveSection('addresses');
                            if (item.id === 'favorites') setActiveSection('favorites');
                            if (item.id === 'settings') setActiveSection('settings');
                        }}
                        className="w-full bg-white px-6 py-5 rounded-2xl flex items-center gap-5 border border-[#E6E0D5] hover:border-[#D4A017]/30 transition-all text-left shadow-sm shadow-black/5 active:scale-[0.98] group"
                    >
                        <span className="text-[#D4A017] group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="text-[#0F2E1A] font-bold flex-1">{item.label}</span>
                        <ChevronRight size={18} className="text-[#0F2E1A]/20" />
                    </button>
                ))}

                <div className="pt-6">
                    <button
                        onClick={logout}
                        className="w-full bg-red-50 text-red-600 px-6 py-5 rounded-2xl flex items-center gap-5 border border-red-100 hover:bg-red-100 transition-all text-left shadow-sm shadow-red-900/5 active:scale-[0.98]"
                    >
                        <LogOut size={20} />
                        <span className="font-bold flex-1">Logout Account</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
