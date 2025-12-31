import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useStoreSettings } from '../hooks/useStoreSettings';

const Footer: React.FC = () => {
  const { settings, loading } = useStoreSettings();

  if (loading) return null;

  // Fallbacks if settings are not yet populated
  const contactAddress = settings?.address || 'Luxury Heights, Sector 12, Delhi - 110001';
  const contactPhone = settings?.phone || '+91 98765 43210';
  const contactEmail = settings?.email || 'royal@currycraft.in';
  const aboutText = settings?.about_text || 'Experience the royal essence of North Indian and Indian Chinese fusion. We craft every dish with authentic spices and modern love.';
  const fbUrl = settings?.facebook_url || '#';
  const igUrl = settings?.instagram_url || '#';
  const twUrl = settings?.twitter_url || '#';

  return (
    <footer className="bg-[#0F2E1A] text-white pt-12 pb-8 px-6 mt-12 rounded-t-[3rem] border-t border-[#D4A017]/20">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#D4A017] mb-4">DDH Curry Craft</h2>
            <p className="text-[#9DB8AA] text-sm leading-relaxed mb-6">
              {aboutText}
            </p>
            <div className="flex gap-4">
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4A017] transition-all group ${!fbUrl || fbUrl === '#' ? 'opacity-30 cursor-not-allowed' : ''}`}>
                <Facebook size={18} className="text-white group-hover:text-[#0F2E1A]" />
              </a>
              <a href={igUrl} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4A017] transition-all group ${!igUrl || igUrl === '#' ? 'opacity-30 cursor-not-allowed' : ''}`}>
                <Instagram size={18} className="text-white group-hover:text-[#0F2E1A]" />
              </a>
              <a href={twUrl} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#D4A017] transition-all group ${!twUrl || twUrl === '#' ? 'opacity-30 cursor-not-allowed' : ''}`}>
                <Twitter size={18} className="text-white group-hover:text-[#0F2E1A]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-4">Explore</h3>
            <ul className="space-y-3 text-sm text-[#9DB8AA]">
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'home' }))} className="hover:text-[#D4A017] transition-colors">Royal Menu</button></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'explore' }))} className="hover:text-[#D4A017] transition-colors">Our Story</button></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'home' }))} className="hover:text-[#D4A017] transition-colors">Special Offers</button></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'profile' }))} className="hover:text-[#D4A017] transition-colors">Loyalty Program</button></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-serif font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D4A017] mt-0.5 flex-shrink-0" />
                <span className="text-[#9DB8AA] text-sm">{contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D4A017] flex-shrink-0" />
                <span className="text-[#9DB8AA] text-sm">{contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D4A017] flex-shrink-0" />
                <span className="text-[#9DB8AA] text-sm">{contactEmail}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9DB8AA]/50 text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2024 DDH Curry Craft. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#9DB8AA]/30">
            <a href="#" className="hover:text-[#D4A017]">Privacy Policy</a>
            <a href="#" className="hover:text-[#D4A017]">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
