import React from 'react';
import { Award, Star, Settings, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { useLoyalty, Tier } from '../../context/LoyaltyContext';

const LoyaltyManager: React.FC = () => {
    const { settings, updateSettings, isLoading } = useLoyalty();

    if (isLoading || !settings) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
            </div>
        );
    }

    const { points_per_rupee, min_redemption_points, tiers } = settings;

    const handleMultiplierChange = (val: number) => {
        updateSettings({ points_per_rupee: val });
    };

    const handleMinRedemptionChange = (val: number) => {
        updateSettings({ min_redemption_points: val });
    };

    const updateTier = (index: number, updates: Partial<Tier>) => {
        const newTiers = [...tiers];
        newTiers[index] = { ...newTiers[index], ...updates };
        updateSettings({ tiers: newTiers });
    };

    const addTier = () => {
        const newTier: Tier = { name: 'New Tier', minPoints: 5000, multiplier: 1.5 };
        updateSettings({ tiers: [...tiers, newTier] });
    };

    const removeTier = (index: number) => {
        const newTiers = tiers.filter((_, i) => i !== index);
        updateSettings({ tiers: newTiers });
    };

    return (
        <div className="p-6">
            <header className="mb-10">
                <h2 className="text-3xl font-serif text-white">Loyalty Program</h2>
                <p className="text-green-400/50">Design and configure rewards for your regular patrons (Synced to Database)</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Basic Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-[#034435] p-8 rounded-3xl border border-green-800/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings className="text-amber-500" size={24} />
                            <h3 className="text-xl font-serif text-white">Earning Rules</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-green-400/60 uppercase tracking-wider block mb-3">Points Multiplier (Points per Rupee)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0.01"
                                        max="1.0"
                                        step="0.01"
                                        value={points_per_rupee}
                                        onChange={(e) => handleMultiplierChange(parseFloat(e.target.value))}
                                        className="flex-1 accent-amber-500"
                                    />
                                    <span className="w-16 text-center bg-green-900 py-1 rounded-lg text-amber-400 font-bold">{points_per_rupee}</span>
                                </div>
                                <p className="text-[11px] text-green-400/40 mt-2 italic">* A setting of 0.1 means 1 point for every ₹10 spent.</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-green-400/60 uppercase tracking-wider block mb-3">Minimum points for Redemption</label>
                                <input
                                    type="number"
                                    value={min_redemption_points}
                                    onChange={(e) => handleMinRedemptionChange(parseInt(e.target.value))}
                                    className="w-full bg-green-900 border border-green-800/30 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 transition-all font-bold"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-green-400/60 uppercase tracking-wider block mb-3">Redemption Rate (₹ value per point)</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="0.01"
                                        max="1.0"
                                        step="0.01"
                                        value={settings.redemption_rate}
                                        onChange={(e) => updateSettings({ redemption_rate: parseFloat(e.target.value) })}
                                        className="flex-1 accent-amber-500"
                                    />
                                    <span className="w-16 text-center bg-green-900 py-1 rounded-lg text-amber-400 font-bold">{settings.redemption_rate}</span>
                                </div>
                                <p className="text-[11px] text-green-400/40 mt-2 italic">
                                    * Rate of {settings.redemption_rate} means {Math.round(100 / settings.redemption_rate)} points = ₹{(100 * settings.redemption_rate).toFixed(0)} discount
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#034435] p-8 rounded-3xl border border-green-800/30">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <Star className="text-amber-500" size={24} />
                                <h3 className="text-xl font-serif text-white">Membership Tiers</h3>
                            </div>
                            <button
                                onClick={addTier}
                                className="text-amber-500 border border-amber-500/30 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-white transition-all"
                            >
                                <Plus size={16} className="inline mr-1" /> Add Tier
                            </button>
                        </div>

                        <div className="space-y-4">
                            {tiers.map((tier, i) => (
                                <div key={i} className="bg-green-900/40 p-5 rounded-2xl border border-green-800/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <input
                                            value={tier.name}
                                            onChange={(e) => updateTier(i, { name: e.target.value })}
                                            className="bg-transparent text-white font-bold mb-1 focus:outline-none border-b border-transparent focus:border-amber-500 w-full"
                                        />
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={tier.minPoints}
                                                onChange={(e) => updateTier(i, { minPoints: parseInt(e.target.value) })}
                                                className="bg-green-950/50 text-green-400 text-xs w-16 p-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                            <span className="text-green-400/50 text-[10px] uppercase tracking-widest">+ Points required</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                                                <input
                                                    type="number"
                                                    step="0.05"
                                                    value={tier.multiplier}
                                                    onChange={(e) => updateTier(i, { multiplier: parseFloat(e.target.value) })}
                                                    className="bg-green-950/50 text-amber-500 w-12 text-center p-1 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                                                />
                                                x
                                            </div>
                                            <div className="text-green-400/40 text-[9px] uppercase tracking-widest">Multiplier</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => removeTier(i)}
                                                className="p-2 text-red-500/60 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Integration Info */}
                <div className="space-y-6">
                    <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <Award size={100} className="absolute -right-4 -bottom-4 opacity-20" />
                        <h3 className="text-lg font-serif mb-4 relative z-10">Admin Tip</h3>
                        <p className="text-sm leading-relaxed opacity-90 relative z-10">
                            Higher multipliers for Silver and Gold tiers encourage customers to order more frequently.
                            Changes are saved instantly to the database.
                        </p>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <ShieldAlert size={20} />
                            <h4 className="font-bold">Important</h4>
                        </div>
                        <p className="text-xs text-red-500/70 leading-relaxed">
                            Points rules are applied at the time of order placement. Changing rules now will not affect points already earned by customers, but new orders will use these settings immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoyaltyManager;
