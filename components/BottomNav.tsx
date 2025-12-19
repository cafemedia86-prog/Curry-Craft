import React from 'react';
import { Home, Compass, Wallet, ChefHat, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  
  const getTabClass = (tabName: string) => {
    const isActive = activeTab === tabName;
    return `flex flex-col items-center gap-1.5 transition-colors ${
        isActive ? 'text-amber-500' : 'text-green-400/40 hover:text-green-200'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#022c22] border-t border-green-900/50 py-4 px-6 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-5px_25px_rgba(0,0,0,0.5)]">
      <button onClick={() => onTabChange('home')} className={getTabClass('home')}>
         <Home size={24} className={activeTab === 'home' ? "fill-amber-500/20" : ""} />
        <span className="text-[10px] font-bold tracking-wide">Home</span>
      </button>

      <button onClick={() => onTabChange('explore')} className={getTabClass('explore')}>
        <Compass size={24} className={activeTab === 'explore' ? "fill-amber-500/20" : ""} />
        <span className="text-[10px] font-medium tracking-wide">Explore</span>
      </button>

      <button onClick={() => onTabChange('wallet')} className={getTabClass('wallet')}>
        <Wallet size={24} className={activeTab === 'wallet' ? "fill-amber-500/20" : ""} />
        <span className="text-[10px] font-medium tracking-wide">Wallet</span>
      </button>

      <button onClick={() => onTabChange('chef')} className={getTabClass('chef')}>
        <ChefHat size={24} className={activeTab === 'chef' ? "fill-amber-500/20" : ""} />
        <span className="text-[10px] font-medium tracking-wide">Chef</span>
      </button>
      
      <button onClick={() => onTabChange('profile')} className={getTabClass('profile')}>
        <User size={24} className={activeTab === 'profile' ? "fill-amber-500/20" : ""} />
        <span className="text-[10px] font-medium tracking-wide">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;