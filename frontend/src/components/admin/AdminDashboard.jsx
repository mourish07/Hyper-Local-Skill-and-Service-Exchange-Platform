import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Clock, CheckCircle, Zap, Shield, Trash2, Search, TrendingUp, Sparkles } from 'lucide-react';
import api from '../../services/api';
import Loader from '../common/Loader';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/users')
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch admin data', error);
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to remove this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loader />;

    const statCards = [
        { label: 'Total Users', value: stats?.userCount, icon: <Users size={24} />, color: 'bg-vibrant-cyan', glow: 'shadow-glow-cyan' },
        { label: 'Offered Skills', value: stats?.serviceCount, icon: <Briefcase size={24} />, color: 'bg-accent', glow: 'shadow-glow-accent' },
        { label: 'Live Requests', value: stats?.pendingRequests, icon: <Clock size={24} />, color: 'bg-vibrant-pink', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]' },
        { label: 'Completed Swaps', value: stats?.completedTasks, icon: <CheckCircle size={24} />, color: 'bg-vibrant-neon', glow: 'shadow-glow-neon' },
        { label: 'Total Coins', value: stats?.totalCoins, icon: <Zap size={24} />, color: 'bg-orange-500', glow: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]' },
    ];

    return (
        <div className="min-h-screen bg-midnight-950 pt-24 pb-12 px-6">
            <div className="container mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-vibrant-cyan" />
                            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">System Administration</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter">Command <span className="text-vibrant-cyan italic">Center</span></h1>
                    </motion.div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
                    {statCards.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card-vibrant p-6 rounded-[2rem] border-white/5 relative overflow-hidden group"
                        >
                            <div className={`p-3 rounded-xl ${stat.color} text-midnight-950 w-fit mb-4 ${stat.glow} transition-transform group-hover:scale-110`}>
                                {stat.icon}
                            </div>
                            <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">{stat.label}</h3>
                            <div className="text-3xl font-black text-white tabular-nums">{stat.value || 0}</div>
                        </motion.div>
                    ))}
                </div>

                {/* User Management Section */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="text-vibrant-cyan" /> Citizen Database
                        </h2>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Filter by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-vibrant-cyan transition-all text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="glass-card-vibrant rounded-[2.5rem] border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">User</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">LVL / XP</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredUsers.map((u) => (
                                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-vibrant-cyan transition-colors">{u.name}</div>
                                                        <div className="text-xs text-slate-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-vibrant-pink/10 text-vibrant-pink' :
                                                    u.role === 'volunteer' ? 'bg-vibrant-cyan/10 text-vibrant-cyan' :
                                                        'bg-slate-700/30 text-slate-400'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 font-black text-white tabular-nums">
                                                {u.balance} <span className="text-[10px] text-slate-500 opacity-60">PTS</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-white">Level {u.level || 1}</span>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-vibrant-neon"
                                                            style={{ width: `${(u.xp || 0) % 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                                                    title="Remove Citizen"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredUsers.length === 0 && (
                            <div className="py-20 text-center">
                                <Search className="mx-auto text-slate-800 mb-4" size={48} />
                                <p className="text-slate-500 font-medium">No citizens matching your search parameters.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
