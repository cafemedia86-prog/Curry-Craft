import React, { useState, useEffect } from 'react';
import { useOrders, OrderStatus } from '../../context/OrderContext';
import { Clock, CheckCircle2, Package, ChefHat, AlertTriangle } from 'lucide-react';

const KitchenDisplaySchema: React.FC = () => {
    const { orders, updateOrderStatus } = useOrders();
    // Filter active orders only
    const activeOrders = orders.filter(o =>
        ['Confirmed', 'Preparing'].includes(o.status)
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Timer Component
    const OrderTimer = ({ date }: { date: string }) => {
        const [elapsed, setElapsed] = useState(0);

        useEffect(() => {
            const startTime = new Date(date).getTime();
            const interval = setInterval(() => {
                const now = new Date().getTime();
                setElapsed(Math.floor((now - startTime) / 60000)); // Minutes
            }, 1000);
            return () => clearInterval(interval);
        }, [date]);

        let color = 'text-green-400';
        if (elapsed > 15) color = 'text-yellow-400';
        if (elapsed > 25) color = 'text-red-500 animate-pulse';

        return (
            <div className={`flex items-center gap-1 font-mono font-bold ${color}`}>
                <Clock size={14} />
                <span>{elapsed} min</span>
            </div>
        );
    };

    return (
        <div className="p-6 h-[calc(100vh-100px)] flex flex-col">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                        <ChefHat className="text-amber-500" /> Kitchen Display System
                    </h2>
                    <p className="text-green-400/50">Live orders for preparation</p>
                </div>
                <div className="bg-[#034435] px-4 py-2 rounded-xl border border-green-800/30 text-green-100 font-mono text-sm">
                    Active: <span className="text-amber-500 font-bold">{activeOrders.length}</span>
                </div>
            </header>

            {activeOrders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-green-400/30 border-2 border-dashed border-green-800/30 rounded-3xl">
                    <ChefHat size={64} className="mb-4 opacity-50" />
                    <p className="text-xl">No active orders</p>
                    <p className="text-sm">Time to clean the station!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-10">
                    {activeOrders.map(order => (
                        <div
                            key={order.id}
                            className={`bg-[#034435] rounded-3xl border-2 flex flex-col shadow-xl overflow-hidden ${order.status === 'Preparing' ? 'border-amber-500/50 shadow-amber-900/20' : 'border-green-800/30'
                                }`}
                        >
                            {/* Card Header */}
                            <div className={`p-4 flex justify-between items-start ${order.status === 'Preparing' ? 'bg-amber-500/10' : 'bg-green-900/20'
                                }`}>
                                <div>
                                    <div className="text-xs text-green-400/60 font-bold uppercase tracking-wider mb-1">
                                        Order #{order.id.slice(0, 8)}
                                    </div>
                                    <div className="text-white font-bold">{order.deliveryAddress === 'Takeaway' ? '🥡 Takeaway' : '🛵 Delivery'}</div>
                                </div>
                                <OrderTimer date={order.date} />
                            </div>

                            {/* Items List */}
                            <div className="p-5 flex-1 space-y-3 overflow-y-auto max-h-[300px]">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-sm border-b border-green-800/30 pb-2 last:border-0 last:pb-0">
                                        <span className="text-green-100 font-medium">{item.name}</span>
                                        <span className="bg-green-950 text-amber-500 font-bold px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                            x{item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Footer */}
                            <div className="p-4 bg-green-950/30 border-t border-green-800/30 mt-auto">
                                {order.status === 'Confirmed' ? (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                        className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
                                    >
                                        <Package size={20} />
                                        Start Cooking
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'Ready')}
                                        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg animate-pulse"
                                    >
                                        <CheckCircle2 size={20} />
                                        Mark Ready
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KitchenDisplaySchema;
