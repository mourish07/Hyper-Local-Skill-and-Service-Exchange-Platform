import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Zap, Sparkles, UserPlus } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { email, password } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(formData);
            navigate(`/${data.role}/dashboard`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                staggerChildren: 0.1
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
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        x: [0, 100, 0],
                        y: [0, 50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -120, 0],
                        x: [0, -80, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-vibrant-pink/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 50, 0],
                        y: [0, -100, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 left-[20%] w-[30%] h-[30%] bg-vibrant-cyan/20 rounded-full blur-[110px]"
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full relative z-10"
            >
                <div className="glass-card-vibrant p-10 rounded-[3rem] border-white/5 relative overflow-hidden group">
                    {/* Decorative header line */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-vibrant-pink to-vibrant-cyan opacity-50" />

                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/20">
                            <Zap className="w-8 h-8 text-accent animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">
                            Welcome <span className="text-accent underline decoration-vibrant-pink underline-offset-8">Back</span>
                        </h2>
                        <p className="text-slate-400 font-medium">Log in to your Electric account</p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 text-sm flex items-center gap-3"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 mb-2 block" htmlFor="email">
                                Email Odyssey
                            </label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-accent transition-colors" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-slate-600"
                                    placeholder="your@destiny.com"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2 block" htmlFor="password">
                                    Secure Key
                                </label>
                                <button type="button" className="text-[10px] font-black text-accent uppercase tracking-widest hover:text-vibrant-pink transition-colors">
                                    Lost Key?
                                </button>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-vibrant-pink transition-colors" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-vibrant-pink/50 focus:border-vibrant-pink transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full btn-vibrant py-4 flex items-center justify-center gap-2 group/btn"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="text-lg">Authorize Entrance</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 font-medium">
                            First time here?{' '}
                            <Link to="/register" className="text-vibrant-cyan hover:text-vibrant-cyan-hover font-black uppercase tracking-widest text-xs ml-2 inline-flex items-center gap-1 group/link">
                                Create Identity
                                <UserPlus className="w-3.5 h-3.5 group-hover/link:scale-110 transition-transform" />
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
