import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, Zap, History, Sparkles, Award, Users, TrendingUp } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import Loader from '../components/common/Loader';

const Wallet = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/requests/transactions');
                const formatted = (response.data || []).map(tx => ({
                    id: tx._id,
                    type: tx.type === 'reward' ? 'earned' : 'spent',
                    amount: tx.amount,
                    desc: tx.description || 'Service Transaction',
                    date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent'
                }));
                setTransactions(formatted);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch transactions', error);
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-midnight-950 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                {/* Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-vibrant p-10 rounded-[2.5rem] mb-12 relative overflow-hidden border-vibrant-cyan/20"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <WalletIcon size={120} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <span className="text-slate-500 font-black uppercase tracking-widest text-xs mb-2 block">Total Balance</span>
                            <div className="flex items-end gap-3">
                                <span className="text-7xl font-black text-white tracking-tighter">
                                    {user?.balance || 0}
                                </span>
                                <span className="text-vibrant-cyan font-black text-xl mb-3 tracking-widest">COINS</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col gap-1 items-center px-8">
                                <span className="text-[10px] font-black text-slate-500 uppercase">Level</span>
                                <span className="text-2xl font-black text-vibrant-neon">{user?.level || 1}</span>
                            </div>
                            <div className="bg-white/5 p-4 rounded-3xl border border-white/10 flex flex-col gap-1 items-center px-8">
                                <span className="text-[10px] font-black text-slate-500 uppercase">Rank</span>
                                <span className="text-2xl font-black text-accent">#12</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar for XP */}
                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400">Next Level Progress</span>
                            <span className="text-xs font-black text-vibrant-neon">{user?.xp % 100}% XP</span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${user?.xp % 100}%` }}
                                className="h-full bg-gradient-to-r from-vibrant-cyan to-vibrant-neon shadow-glow-neon"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid - Smaller */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card-vibrant p-6 rounded-3xl border-white/5"
                    >
                        <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Achievements & Badges</h3>
                        <div className="flex flex-wrap gap-4">
                            {(user?.badges || []).length > 0 ? (
                                user.badges.map((badge, idx) => (
                                    <div key={idx} className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent shadow-glow-accent border border-accent/30" title={badge}>
                                        <Award size={24} />
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-700 border border-white/5 grayscale" title="First Swap (Locked)">
                                        <Sparkles size={24} />
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-700 border border-white/5 grayscale" title="Community Pillar (Locked)">
                                        <Users size={24} />
                                    </div>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-700 border border-white/5 grayscale" title="Top Earner (Locked)">
                                        <Zap size={24} />
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card-vibrant p-6 rounded-3xl border-white/5 flex flex-col justify-center"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-vibrant-neon" size={20} />
                            <span className="text-white font-bold">Contribution Level</span>
                        </div>
                        <p className="text-slate-500 text-xs">You are in the top 15% of contributors in your area. Keep it up!</p>
                    </motion.div>
                </div>

                {/* Transaction History */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <History className="text-vibrant-pink" />
                        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {transactions.map((tx, idx) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card-vibrant p-5 rounded-3xl flex items-center justify-between border-white/5 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl ${tx.type === 'earned' ? 'bg-vibrant-neon/10 text-vibrant-neon' : 'bg-vibrant-pink/10 text-vibrant-pink'}`}>
                                        {tx.type === 'earned' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{tx.desc}</h4>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                                            <Clock size={12} />
                                            <span>{tx.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-xl font-black ${tx.type === 'earned' ? 'text-vibrant-neon' : 'text-slate-400'}`}>
                                    {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Wallet;
