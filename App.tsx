import React, { useState } from 'react';
import Navbar from './components/Navbar';
import SpecialOffers from './components/SpecialOffers';
import Menu from './components/Menu';
import BottomNav from './components/BottomNav';
import ProductModal from './components/ProductModal';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';
import { MenuItem } from './types';
import { Wallet, ChefHat, User, Settings, CreditCard, Award, Clock, Heart, MapPin } from 'lucide-react';

const WalletPage = () => (
    <div className="p-5 animate-in slide-in-from-right duration-300">
        <h2 className="text-2xl font-serif text-white mb-6">My Wallet</h2>
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
             <div className="relative z-10">
                 <span className="text-amber-100 text-sm">Total Balance</span>
                 <div className="text-4xl font-bold mt-1 mb-4">₹ 2,450.00</div>
                 <div className="flex gap-4">
                     <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">Add Money</button>
                     <button className="bg-white/20 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm">History</button>
                 </div>
             </div>
             <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4">
                 <Wallet size={150} />
             </div>
        </div>
        
        <h3 className="text-white font-bold mb-4">Payment Methods</h3>
        <div className="space-y-3">
             <div className="bg-[#034435] p-4 rounded-xl flex items-center gap-4 border border-green-800/30">
                 <CreditCard className="text-amber-400" />
                 <div className="flex-1">
                     <div className="text-white font-medium">HDFC Bank Credit Card</div>
                     <div className="text-green-400/50 text-xs">**** **** **** 4582</div>
                 </div>
             </div>
        </div>
    </div>
);

const ChefPage = () => (
     <div className="p-5 animate-in slide-in-from-right duration-300">
        <h2 className="text-2xl font-serif text-white mb-6">Our Chefs</h2>
        <div className="bg-[#034435] rounded-3xl overflow-hidden shadow-lg border border-green-800/30">
             <img src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=800&q=80" className="w-full h-48 object-cover" />
             <div className="p-5">
                 <h3 className="text-xl font-serif text-white font-bold">Master Chef Anjali</h3>
                 <p className="text-amber-500 text-sm font-bold mb-3">Head of Curry Craft</p>
                 <p className="text-green-100/70 text-sm leading-relaxed mb-4">
                     With over 15 years of experience in royal Mughlai cuisine, Chef Anjali brings ancient recipes to life with a modern twist.
                 </p>
                 <button className="w-full bg-green-900 text-amber-400 py-3 rounded-xl font-bold hover:bg-green-800">View Special Menu</button>
             </div>
        </div>
    </div>
);

const ProfilePage = () => (
     <div className="p-5 animate-in slide-in-from-right duration-300">
        <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center text-[#022c22] text-2xl font-bold">
                JD
            </div>
            <div>
                <h2 className="text-2xl font-serif text-white">John Doe</h2>
                <p className="text-green-400/60 text-sm">Gold Member</p>
            </div>
        </div>

        <div className="space-y-1">
            {[
                { icon: <Clock size={20} />, label: 'Order History' },
                { icon: <Heart size={20} />, label: 'Favorites' },
                { icon: <MapPin size={20} />, label: 'Saved Addresses' },
                { icon: <Award size={20} />, label: 'Loyalty Points' },
                { icon: <Settings size={20} />, label: 'Settings' },
            ].map((item, i) => (
                <button key={i} className="w-full bg-[#034435] p-4 rounded-xl flex items-center gap-4 border border-green-800/30 hover:bg-[#045c48] transition-colors text-left mb-3">
                    <span className="text-amber-400">{item.icon}</span>
                    <span className="text-white font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    </div>
);

// --- Main App Component ---

function App() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [currentTab, setCurrentTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle tab switching
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    // Reset search when leaving searchable tabs if desired, currently keeping state
    if (tab !== 'home' && tab !== 'explore') {
        setSearchQuery('');
    }
  };

  const renderContent = () => {
      switch(currentTab) {
          case 'home':
              return (
                  <>
                    {!searchQuery && <SpecialOffers />}
                    <Menu 
                      onProductClick={setSelectedProduct} 
                      searchQuery={searchQuery} 
                    />
                  </>
              );
          case 'explore':
               // Explore reuses Menu but maybe we can trigger a specific state. 
               // For now, it shows the full menu search interface.
              return (
                  <div className="pt-4">
                    <h2 className="text-2xl font-serif text-white px-5 mb-4">Explore Menu</h2>
                    <Menu 
                      onProductClick={setSelectedProduct} 
                      searchQuery={searchQuery} 
                    />
                  </div>
              );
          case 'wallet':
              return <WalletPage />;
          case 'chef':
              return <ChefPage />;
          case 'profile':
              return <ProfilePage />;
          default:
              return <Menu onProductClick={setSelectedProduct} searchQuery={searchQuery} />;
      }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#022c22] text-green-50 font-sans selection:bg-amber-500 selection:text-white pb-24">
        
        {/* Navbar is persistent across tabs for this design */}
        <Navbar onSearch={setSearchQuery} searchTerm={searchQuery} />
        
        <main className="pt-2">
           {renderContent()}
        </main>
        
        <BottomNav activeTab={currentTab} onTabChange={handleTabChange} />
        <CartSidebar />
        
        {/* Product Details Modal */}
        {selectedProduct && (
            <ProductModal 
                item={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
        )}
      </div>
    </CartProvider>
  );
}

export default App;