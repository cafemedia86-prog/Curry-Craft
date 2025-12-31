import React, { useState } from 'react';
import { Wallet, CreditCard, Plus, Clock, IndianRupee, History, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useLoyalty } from '../context/LoyaltyContext';
import { Crown, Star, ChevronRight, X, LayoutList } from 'lucide-react';
import AddMoneyModal from './AddMoneyModal';

const LoyaltyStatusCard = () => {
    const { user } = useAuth();
    const { getTier, nextTier } = useLoyalty();

    if (!user) return null;

    const currentPoints = user.loyaltyPoints || 0;
    const tier = getTier(currentPoints);
    const next = nextTier(currentPoints);

    // Progress calculation
    let progress = 100;
    if (next) {
        const span = next.minPoints - tier.minPoints;
        const currentInSpan = currentPoints - tier.minPoints;
        progress = Math.min(100, Math.max(0, (currentInSpan / span) * 100));
    }

    const getTierColor = (name: string) => {
        switch (name.toLowerCase()) {
            case 'silver': return 'from-slate-200 to-slate-400';
            case 'gold': return 'from-[#D4A017] to-[#F4C430]';
            default: return 'from-orange-400 to-orange-700'; // Bronze
        }
    };

    return (
        <div className="mb-10 relative overflow-hidden group">
            <div className="bg-white p-7 rounded-[2.5rem] border border-[#E6E0D5] relative z-10 shadow-sm shadow-black/5">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#D4A017]/10 flex items-center justify-center">
                                <Crown className="text-[#D4A017]" size={16} />
                            </div>
                            <span className="text-[#D4A017] font-bold uppercase tracking-[0.15em] text-[10px]">Royal Loyalty</span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-[#0F2E1A]">{tier.name} Member</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-[#0F2E1A] leading-none mb-1">{currentPoints}</div>
                        <div className="text-[#0F2E1A]/40 text-[10px] uppercase font-bold tracking-widest">Points</div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between text-xs mb-3">
                        <span className="text-[#0F2E1A]/60 font-medium">Current Tier Benefit</span>
                        <span className="text-[#D4A017] font-bold">{tier.multiplier}x Points</span>
                    </div>
                    <div className="h-2.5 bg-[#F5F1E8] rounded-full overflow-hidden border border-[#E6E0D5]/50">
                        <div
                            className={`h-full bg-gradient-to-r ${getTierColor(tier.name)} transition-all duration-1000 rounded-full`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    {next && (
                        <div className="flex justify-between items-center mt-3">
                            <span className="text-[11px] text-[#0F2E1A]/40 font-medium">
                                <span className="text-[#D4A017] font-bold">{next.minPoints - currentPoints}</span> points to <span className="text-[#0F2E1A] font-bold">{next.name}</span>
                            </span>
                            <span className="text-[11px] text-[#0F2E1A] font-bold uppercase tracking-widest opacity-30">{next.name}</span>
                        </div>
                    )}
                    {!next && (
                        <div className="mt-4 text-[11px] text-[#D4A017] text-center font-bold uppercase tracking-[0.2em] bg-[#D4A017]/5 py-2 rounded-xl">Max Tier Reached</div>
                    )}
                </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#D4A017]/5 rounded-full blur-3xl -z-0" />
        </div>
    );
};

const WalletPage = () => {
    const { user } = useAuth();
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [view, setView] = useState<'main' | 'history'>('main');

    if (!user) return null;

    if (view === 'history') {
        return (
            <div className="p-5 animate-in slide-in-from-right duration-300">
                <header className="flex items-center gap-4 mb-8">
                    <button onClick={() => setView('main')} className="p-2 bg-[#0F2E1A] rounded-full text-[#D4A017]">
                        <Plus className="rotate-45" size={20} />
                    </button>
                    <h2 className="text-2xl font-serif font-bold text-[#0F2E1A]">Transaction History</h2>
                </header>
                <TransactionList full />
            </div>
        );
    }

    return (
        <div className="p-5 animate-in slide-in-from-right duration-300">
            <h2 className="text-3xl font-serif font-bold text-[#0F2E1A] mb-8">My Royal Wallet</h2>

            <div className="bg-[#0F2E1A] rounded-[2.5rem] p-8 text-white shadow-2xl mb-10 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Wallet size={200} />
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A017]/10 blur-[80px] rounded-full" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <IndianRupee size={16} className="text-[#D4A017]" />
                        <span className="text-[#FAF7F0]/60 text-[10px] font-bold uppercase tracking-[0.2em]">Available Balance</span>
                    </div>
                    <div className="text-5xl font-bold mb-8 font-sans">₹{user.walletBalance.toLocaleString('en-IN')}</div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsAddMoneyOpen(true)}
                            className="bg-[#D4A017] text-[#0F2E1A] px-7 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-[#D4A017]/20 flex items-center justify-center gap-2 transition-all hover:bg-[#F4C430] active:scale-95 flex-1"
                        >
                            <Plus size={20} /> Add Money
                        </button>
                        <button
                            onClick={() => setView('history')}
                            className="bg-[#FAF7F0]/10 border border-[#FAF7F0]/20 px-7 py-4 rounded-2xl text-sm font-bold backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:bg-[#FAF7F0]/15 active:scale-95 flex-1"
                        >
                            <History size={20} /> History
                        </button>
                    </div>
                </div>
            </div>

            <LoyaltyStatusCard />

            <div className="flex justify-between items-center mb-5 px-1">
                <h3 className="text-[#0F2E1A] text-xl font-serif font-bold">Payment Methods</h3>
                <button className="text-[#D4A017] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    Manage
                </button>
            </div>

            <div className="space-y-4 mb-10">
                <div className="bg-white p-5 rounded-[2rem] flex items-center gap-4 border border-[#E6E0D5] hover:border-[#D4A017]/30 transition-all shadow-sm shadow-black/5 group cursor-pointer">
                    <div className="p-3 bg-[#0F2E1A]/5 rounded-2xl group-hover:bg-[#0F2E1A] group-hover:text-[#D4A017] transition-all">
                        <CreditCard className="text-[#0F2E1A] group-hover:text-[#D4A017]" size={24} />
                    </div>
                    <div className="flex-1">
                        <div className="text-[#0F2E1A] font-bold">Primary Card</div>
                        <div className="text-[#0F2E1A]/40 text-xs">Visa ending in •••• 4582</div>
                    </div>
                    <div className="px-3 py-1 bg-[#DCEFE4] rounded-full text-green-700 text-[9px] font-bold uppercase tracking-widest shadow-sm">Active</div>
                </div>

                <button className="w-full py-5 border-2 border-dashed border-[#E6E0D5] rounded-[2rem] text-[#0F2E1A]/30 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-[#D4A017]/30 transition-all active:scale-[0.98]">
                    <Plus size={18} /> Add New Method
                </button>
            </div>

            <div className="flex justify-between items-center mb-5 px-1">
                <h3 className="text-[#0F2E1A] text-xl font-serif font-bold">Recent Transactions</h3>
                <button onClick={() => setView('history')} className="text-[#D4A017] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    See All <ChevronRight size={14} />
                </button>
            </div>

            <TransactionList />

            <AddMoneyModal
                isOpen={isAddMoneyOpen}
                onClose={() => setIsAddMoneyOpen(false)}
            />
        </div>
    );
};

const TransactionList = ({ full = false }: { full?: boolean }) => {
    const [transactions, setTransactions] = React.useState<any[]>([]);
    const { user } = useAuth();
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (user) {
            const fetchTransactions = async () => {
                const { data } = await supabase
                    .from('wallet_transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(full ? 50 : 5);

                if (data) setTransactions(data);
                setLoading(false);
            };
            fetchTransactions();
        }
    }, [user, full]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-10 opacity-30">
            <Clock size={40} className="animate-spin mb-3" />
            <p className="text-xs font-bold uppercase tracking-widest">Updating Ledger...</p>
        </div>
    );

    if (transactions.length === 0) return (
        <div className="py-12 px-6 text-center border-2 border-dashed border-[#E6E0D5] rounded-[2rem] bg-white/50">
            <LayoutList size={40} className="mx-auto text-[#0F2E1A]/10 mb-3" />
            <p className="text-[#0F2E1A]/40 text-sm font-medium italic">Your financial record is currently empty.</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {transactions.map(tx => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-[#E6E0D5] shadow-sm flex justify-between items-center hover:border-[#D4A017]/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tx.amount > 0 ? 'bg-[#DCEFE4] text-green-700' : 'bg-[#0F2E1A]/5 text-[#0F2E1A]'}`}>
                            {tx.amount > 0 ? <Plus size={18} /> : <CreditCard size={18} />}
                        </div>
                        <div>
                            <div className="text-[#0F2E1A] font-bold text-sm tracking-tight">{tx.description}</div>
                            <div className="text-[#0F2E1A]/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                {new Date(tx.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                    <div className={`text-base font-bold font-sans ${tx.amount > 0 ? 'text-green-600' : 'text-[#0F2E1A]'}`}>
                        {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WalletPage;

