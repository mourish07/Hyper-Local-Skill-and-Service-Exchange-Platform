import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Zap, User } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/common/Loader';

const Leaderboard = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await api.get('/admin/users'); // Use list of users for ranking
                const sorted = (response.data || []).sort((a, b) => (b.xp || 0) - (a.xp || 0)).slice(0, 10);
                setRankings(sorted);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch rankings', error);
                setLoading(false);
            }
        };
        fetchRankings();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-midnight-950 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 bg-accent/20 rounded-full mb-6 border border-accent/30 shadow-glow-accent"
                    >
                        <Trophy size={48} className="text-accent" />
                    </motion.div>
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Community <span className="text-vibrant-cyan">Champions</span></h1>
                    <p className="text-slate-500 max-w-lg mx-auto">Celebrating the most active volunteers and skill-swappers this month.</p>
                </header>

                <div className="flex flex-col gap-4">
                    {rankings.map((person, idx) => (
                        <motion.div
                            key={person._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-card-vibrant p-4 px-8 rounded-3xl flex items-center justify-between border-white/5 relative overflow-hidden group ${idx === 0 ? 'border-accent/40 bg-accent/5' : ''}`}
                        >
                            {idx === 0 && <Crown className="absolute -top-2 -left-2 text-accent rotate-[-15deg]" size={40} />}

                            <div className="flex items-center gap-8">
                                <span className={`text-2xl font-black w-8 ${idx === 0 ? 'text-accent' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'}`}>
                                    #{idx + 1}
                                </span>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                        {person.profilePicture ? <img src={person.profilePicture} alt="" /> : <User className="opacity-20" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-vibrant-cyan transition-colors">{person.name}</h4>
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Level {person.level || 1}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">XP Earned</span>
                                    <span className="text-white font-black">{person.xp || 0}</span>
                                </div>
                                <div className="bg-vibrant-neon/10 text-vibrant-neon px-6 py-2 rounded-2xl border border-vibrant-neon/20 font-black">
                                    {person.balance || 0} <span className="text-[10px] opacity-60">PTS</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
