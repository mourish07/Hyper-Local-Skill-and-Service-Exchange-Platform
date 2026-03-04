import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, User, ArrowUpRight, Heart, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

const ServiceCard = ({ service, onRequest }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [hovered, setHovered] = useState(false);

    const toggleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
    };

    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ y: -10 }}
            className="glass-card-vibrant p-6 rounded-[2.5rem] flex flex-col justify-between h-full group border-vibrant-cyan/5 relative overflow-hidden"
        >
            {/* Background Glow Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-[80px] group-hover:bg-accent/20 transition-all duration-700" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-vibrant-pink/10 rounded-full blur-[80px] group-hover:bg-vibrant-pink/20 transition-all duration-700" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-3 bg-vibrant-cyan/10 text-vibrant-cyan rounded-2xl group-hover:bg-vibrant-cyan group-hover:text-midnight-950 transition-all duration-500 shadow-glow-cyan">
                            <Star className="w-6 h-6" />
                        </div>
                        {service.rating && (
                            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                <Star className="w-3 h-3 text-accent fill-accent" />
                                <span className="text-[10px] font-black text-white">{service.rating}</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 1.5 }}
                        onClick={toggleFavorite}
                        className={`p-3 rounded-2xl border transition-all duration-500 ${isFavorite
                            ? 'bg-vibrant-pink text-white border-vibrant-pink shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                            : 'bg-white/5 text-slate-500 border-white/10 hover:border-vibrant-pink/30 hover:text-vibrant-pink'
                            }`}
                    >
                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </motion.button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-vibrant-cyan bg-vibrant-cyan/10 px-3 py-1 rounded-full">
                        {service.category}
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase">Verified</span>
                    </div>
                    {service.allowSkillSwap && (
                        <div className="flex items-center gap-1 bg-vibrant-pink/10 text-vibrant-pink px-2 py-1 rounded-full border border-vibrant-pink/20">
                            <Zap className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-tight">Skill Swap</span>
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-vibrant-cyan transition-colors leading-tight">
                    {service.title}
                </h3>
                <p className="text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {service.description}
                </p>

                <div className="flex items-center flex-wrap gap-3 mb-8">
                    <div className="flex items-center gap-1.5 text-accent font-black text-xs bg-accent/10 px-4 py-2 rounded-2xl border border-accent/20">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        {service.points} <span className="opacity-60">PTS</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                        <MapPin className="w-3.5 h-3.5" /> {service.location}
                    </div>
                </div>
            </div>

            <div className="mt-auto relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-vibrant-pink p-[2px]">
                                <div className="w-full h-full rounded-[0.9rem] bg-midnight-950 flex items-center justify-center text-white overflow-hidden">
                                    <User className="w-6 h-6 opacity-40" />
                                </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-vibrant-neon rounded-full border-2 border-midnight-950" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Expert</span>
                            <span className="text-sm text-white font-bold group-hover:text-vibrant-cyan transition-colors line-clamp-1">{service.provider?.name || 'Unknown Expert'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <AnimatePresence>
                            {hovered && (
                                <motion.button
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    onClick={(e) => { e.stopPropagation(); alert('Messaging feature coming soon!'); }}
                                    className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-colors"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRequest(service)}
                            className="p-4 bg-vibrant-cyan text-midnight-950 rounded-2xl transition-all shadow-glow-cyan font-black flex items-center gap-2 group/btn"
                        >
                            <span className="text-xs uppercase tracking-widest hidden group-hover:block ml-1">Trade</span>
                            <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
