import { useEffect, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Heart, Award, Globe, MessageSquare, Star } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Removed automatic redirect to allow viewing landing page while logged in
    useEffect(() => {
        console.log('Home: Landing Page Rendered');
    }, []);

    return (
        <div className="bg-midnight-950 min-h-screen selection:bg-vibrant-cyan/30 pt-10">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vibrant-cyan/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-vibrant-pink/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="container mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                            TRADE YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vibrant-cyan via-accent to-vibrant-pink">TALENT.</span>
                        </h1>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            The ultimate hyperlocal marketplace to swap skills, earn rewards, and build meaningful connections with your neighbors.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/register" className="bg-vibrant-cyan text-midnight-950 font-black px-10 py-5 rounded-2xl text-lg hover:shadow-glow-cyan transition-all transform hover:-translate-y-1">
                                Get Started
                            </Link>
                            <Link to="/login" className="bg-white/5 text-white border border-white/10 font-black px-10 py-5 rounded-2xl text-lg hover:bg-white/10 transition-all">
                                Learn More
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Preview */}
            <section className="py-24 px-6 relative z-10">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Swap Skills', desc: 'No money? No problem. Trade your coding for gardening.', icon: <Zap className="text-vibrant-cyan" /> },
                            { title: 'Earn Badges', desc: 'Get recognized for your community contributions.', icon: <Award className="text-accent" /> },
                            { title: 'Build Trust', desc: 'Verified neighbors and mutual review systems.', icon: <ShieldCheck className="text-vibrant-neon" /> },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card-vibrant p-10 rounded-[2.5rem] border-white/5"
                            >
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
