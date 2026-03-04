import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, MapPin, Sparkles, Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        location: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { name, email, password, role, location } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData);
            navigate(`/${data.role}/dashboard`);
        } catch (err) {
            console.error('Registration Error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 bg-midnight-950 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 45, 0],
                        x: [0, -50, 0],
                        y: [0, 80, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 w-[50%] h-[50%] bg-vibrant-cyan/15 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-accent/15 rounded-full blur-[120px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-[32rem] w-full relative z-10 py-10"
            >
                <div className="glass-card-vibrant p-10 rounded-[3.5rem] border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-vibrant-cyan via-vibrant-pink to-accent opacity-60" />

                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <div className="w-16 h-16 bg-vibrant-pink/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-vibrant-pink/20">
                            <Sparkles className="w-8 h-8 text-vibrant-pink animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                            Create <span className="text-vibrant-cyan underline decoration-accent underline-offset-8 text-shadow-glow">Identity</span>
                        </h2>
                        <p className="text-slate-400 font-medium">Join the Electric community today</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm flex items-center gap-3"
                        >
                            <ShieldCheck className="w-5 h-5 opacity-50" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <motion.div variants={itemVariants} className="sm:col-span-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 block">Full Name</label>
                                <div className="relative group/input">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-vibrant-cyan transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-vibrant-cyan/50 focus:border-vibrant-cyan transition-all placeholder:text-slate-600"
                                        placeholder="Explorer Name"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="sm:col-span-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 block">Email Portal</label>
                                <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-vibrant-pink transition-colors" />
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={onChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-vibrant-pink/50 focus:border-vibrant-pink transition-all placeholder:text-slate-600"
                                        placeholder="echo@vibrant.io"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 block">Secure Key</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-accent transition-colors" />
                                    <input
                                        required
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={onChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-slate-600"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 block">World Location</label>
                                <div className="relative group/input">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-vibrant-cyan transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        name="location"
                                        value={location}
                                        onChange={onChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-vibrant-cyan/50 focus:border-vibrant-cyan transition-all placeholder:text-slate-600"
                                        placeholder="City, Planet"
                                    />
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="sm:col-span-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-3 block">Choose Your Path</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['user', 'volunteer', 'admin'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: r })}
                                            className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${role === r
                                                ? 'bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                                                : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full btn-vibrant py-5 flex items-center justify-center gap-3 group/btn"
                        >
                            <Zap className="w-5 h-5" />
                            <span className="text-lg">Initialize Origin</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 font-medium">
                            Already exist?{' '}
                            <Link to="/login" className="text-vibrant-pink hover:text-vibrant-pink-hover font-black uppercase tracking-widest text-xs ml-2 inline-flex items-center gap-1 group/link">
                                Restore Session
                                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
