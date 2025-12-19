import React from 'react';

const SpecialOffers: React.FC = () => {
  return (
    <section className="pt-6 pb-4 pl-5">
      <div className="flex items-end pr-5 mb-4">
        <h3 className="text-xl font-sans font-bold text-white tracking-wide">Special Offers</h3>
      </div>
      
      <div className="overflow-x-auto flex gap-4 pb-4 pr-5 snap-x">
        {/* Card 1 */}
        <div className="snap-center min-w-[85%] md:min-w-[380px] h-44 bg-[#034435] rounded-3xl relative overflow-hidden shadow-lg shadow-black/20 flex-shrink-0 flex items-center p-5 border border-green-800/30">
           {/* Left Content */}
           <div className="flex-1 z-10 flex flex-col items-start gap-1">
             <span className="text-green-300/80 text-xs font-medium">Limited time!</span>
             <h4 className="text-xl font-serif text-white leading-tight">Get Special Offer</h4>
             <div className="flex items-baseline gap-1 mb-3">
                <span className="text-green-200 text-sm">Up to</span>
                <span className="text-3xl font-bold text-amber-400">40%</span>
             </div>
             <button className="bg-amber-500 text-[#022c22] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-amber-400 transition-colors">
               Shop Now
             </button>
           </div>
           
           {/* Right Image */}
           <div className="w-36 h-36 rounded-full border-4 border-[#022c22]/50 shadow-2xl overflow-hidden -mr-8 flex-shrink-0">
               <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80" alt="Special" className="w-full h-full object-cover" />
           </div>
           
           {/* Decorative bg blobs */}
           <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
        </div>

        {/* Card 2 */}
        <div className="snap-center min-w-[85%] md:min-w-[380px] h-44 bg-[#034435] rounded-3xl relative overflow-hidden shadow-lg shadow-black/20 flex-shrink-0 flex items-center p-5 border border-green-800/30">
           {/* Left Content */}
           <div className="flex-1 z-10 flex flex-col items-start gap-1">
             <span className="text-green-300/80 text-xs font-medium">Today only!</span>
             <h4 className="text-xl font-serif text-white leading-tight">Biryani Special</h4>
             <div className="flex items-baseline gap-1 mb-3">
                <span className="text-green-200 text-sm">Up to</span>
                <span className="text-3xl font-bold text-amber-400">30%</span>
             </div>
             <button className="bg-amber-500 text-[#022c22] px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-amber-400 transition-colors">
               Shop Now
             </button>
           </div>
           
           {/* Right Image */}
           <div className="w-36 h-36 rounded-full border-4 border-[#022c22]/50 shadow-2xl overflow-hidden -mr-8 flex-shrink-0">
               <img src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80" alt="Biryani" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;