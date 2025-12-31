import React, { useState } from 'react';
import { X, Check, Loader2, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AddMoneyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
    const { updateWallet } = useAuth();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'input' | 'success'>('input');

    const amounts = [100, 200, 500, 1000, 2000, 5000];

    const handleAdd = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setIsLoading(true);
        try {
            // In a real app, this would involve a payment gateway like Razorpay/Stripe
            // For now, we simulate a successful transaction
            await new Promise(resolve => setTimeout(resolve, 1500));
            await updateWallet(numAmount);
            setStep('success');
            setTimeout(() => {
                onClose();
                setStep('input');
                setAmount('');
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-[#FAF7F0] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-[#D4A017]/20">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-[#0F2E1A]/5 rounded-full text-[#0F2E1A] hover:bg-[#0F2E1A]/10 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {step === 'input' ? (
                        <>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-[#D4A017]/10 rounded-2xl flex items-center justify-center text-[#D4A017]">
                                    <IndianRupee size={24} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-[#0F2E1A]">Add Money</h3>
                            </div>

                            <p className="text-[#0F2E1A]/60 text-sm mb-8 font-medium">
                                Recharge your Royal Wallet instantly for a seamless checkout experience.
                            </p>

                            <div className="mb-8">
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#0F2E1A]">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-[#0F2E1A]/5 border border-[#D4A017]/10 rounded-2xl pl-12 pr-6 py-5 text-3xl font-bold text-[#0F2E1A] focus:outline-none focus:ring-2 focus:ring-[#D4A017]/50 transition-all font-mono"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {amounts.map(a => (
                                    <button
                                        key={a}
                                        onClick={() => setAmount(a.toString())}
                                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${amount === a.toString()
                                                ? 'bg-[#0F2E1A] border-[#D4A017] text-[#D4A017] shadow-lg shadow-[#0F2E1A]/20'
                                                : 'bg-white border-[#E6E0D5] text-[#0F2E1A] hover:border-[#D4A017]/50'
                                            }`}
                                    >
                                        +₹{a}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={!amount || isLoading}
                                className="w-full bg-[#0F2E1A] text-[#FAF7F0] font-bold py-5 rounded-2xl hover:bg-[#12422A] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#0F2E1A]/20 flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>Proceed to Pay ₹{amount || '0'}</>
                                )}
                            </button>
                        </>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                                <Check size={40} strokeWidth={3} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-[#0F2E1A] mb-2">Recharge Successful!</h3>
                            <p className="text-[#0F2E1A]/60 font-medium">Your balance has been updated.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMoneyModal;
