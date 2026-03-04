import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Sparkles, Filter, Zap, Star, Heart, ArrowRight, TrendingUp, CheckCircle, Clock, Loader2 } from 'lucide-react';
import serviceService from '../../services/service.service';
import requestService from '../../services/request.service';
import reviewService from '../../services/review.service';
import ServiceCard from '../common/ServiceCard';
import Loader from '../common/Loader';
import AuthContext from '../../context/AuthContext';

const UserDashboard = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [userTasks, setUserTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedService, setSelectedService] = useState(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '', serviceId: '' });

    const categories = ['All', 'Tech', 'Home', 'Education', 'Wellness', 'Creative'];

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        fetchData();
    }, [searchTerm, activeCategory]);

    const fetchData = async () => {
        try {
            const [servicesData, tasksData] = await Promise.all([
                serviceService.getServices({
                    keyword: searchTerm,
                    category: activeCategory === 'All' ? undefined : activeCategory
                }),
                requestService.getRequests('user')
            ]);

            setServices(servicesData || []);
            setUserTasks((tasksData || []).filter(t => t && (t.status === 'accepted' || t.status === 'pending')));

            if (searchTerm.length > 1) {
                setSuggestions(servicesData.slice(0, 5));
            } else {
                setSuggestions([]);
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const data = await serviceService.getServices({
                keyword: searchTerm,
                category: activeCategory === 'All' ? undefined : activeCategory
            });
            setServices(data);
            if (searchTerm.length > 1) {
                setSuggestions(data.slice(0, 5));
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setShowSuggestions(false);
        fetchServices();
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.title);
        setShowSuggestions(false);
    };

    const handleRequestClick = (service) => {
        setSelectedService(service);
        setShowModal(true);
        setError('');
        setSuccess('');
        setRequestMessage('');
    };

    const [requestMode, setRequestMode] = useState('coins');

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await requestService.createRequest({
                serviceId: selectedService._id,
                message: requestMessage,
                mode: requestMode
            });
            setSuccess('Request sent successfully!');
            setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send request');
        }
    };

    const handleFinishTask = async (taskId) => {
        try {
            const task = userTasks.find(t => t._id === taskId);
            await requestService.updateRequestStatus(taskId, 'completed');
            await fetchData();
            await refreshUser();

            // Open review modal
            setReviewData({
                ...reviewData,
                serviceId: task.service._id,
                reviewee: task.volunteer._id
            });
            setShowReviewModal(true);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit task');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewSubmitting(true);
        try {
            await reviewService.addReview(reviewData);
            setShowReviewModal(false);
            alert('Review submitted! Thank you.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };


    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-midnight-950 pb-20 pt-10 px-6">
            <div className="container mx-auto">
                {/* Header Section */}
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
                    >
                        <div className="max-w-xl">
                            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                                Find the <span className="text-vibrant-cyan">Perfect Skill</span> <br />
                                <span className="text-slate-500 font-light italic">Exchange with Neighbors.</span>
                            </h1>
                            <div className="flex flex-col gap-4">
                                <span className="flex items-center w-fit gap-1.5 bg-accent/20 px-4 py-1.5 rounded-full border border-accent/30 text-[10px] font-black uppercase tracking-widest text-white shadow-glow-accent">
                                    <Zap className="w-3.5 h-3.5 fill-current" /> {user?.balance || 0} Points
                                </span>

                                {/* Gamification Level Bar */}
                                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10 w-full md:w-[400px]">
                                    <div className="w-12 h-12 rounded-xl bg-vibrant-neon flex items-center justify-center text-midnight-950 font-black text-xl shadow-glow-neon">
                                        {user?.level || 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Level Progress</span>
                                            <span className="text-[10px] font-black text-vibrant-neon uppercase">{user?.xp % 100}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${user?.xp % 100}%` }}
                                                className="h-full bg-vibrant-neon shadow-glow-neon"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-auto relative">
                            <form onSubmit={handleSearch} className="relative z-20">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for skills, services..."
                                    value={searchTerm}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full lg:w-[400px] pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-vibrant-cyan transition-all text-white placeholder:text-slate-500 backdrop-blur-md"
                                />
                                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-vibrant-cyan text-midnight-950 font-bold px-6 rounded-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    Search
                                </button>
                            </form>

                            <AnimatePresence>
                                {showSuggestions && suggestions.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-midnight-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden"
                                    >
                                        {suggestions.map((suggestion) => (
                                            <button
                                                key={suggestion._id}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-6 py-4 hover:bg-white/5 text-slate-300 hover:text-vibrant-cyan transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                                            >
                                                <Zap className="w-4 h-4" />
                                                <span>{suggestion.title}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </header>

                {/* Category Pills */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar mb-12"
                >
                    <div className="flex items-center p-2 bg-white/5 border border-white/10 rounded-2xl text-slate-400 mr-2">
                        <Filter className="w-5 h-5" />
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap border ${activeCategory === cat
                                ? 'bg-accent text-white border-accent shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105'
                                : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* My Tasks Section */}
                <AnimatePresence>
                    {userTasks.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-16"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <CheckCircle className="text-vibrant-neon animate-pulse" /> My Active Tasks
                                </h2>
                                <span className="text-slate-500 text-sm font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                    {userTasks.length} Assigned
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userTasks.map((task) => (
                                    <motion.div
                                        key={task._id}
                                        variants={itemVariants}
                                        className="glass-card-vibrant p-6 rounded-3xl relative overflow-hidden group border-vibrant-neon/30"
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <div className="w-2 h-2 rounded-full bg-vibrant-neon animate-ping" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 inline-block ${task.status === 'accepted' ? 'bg-vibrant-neon/10 text-vibrant-neon' : 'bg-accent/10 text-accent'}`}>
                                            {task.status === 'accepted' ? 'In Progress' : 'Pending Approval'}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mb-2">{task.service?.title || 'Deleted Service'}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            Volunteer: <span className="text-vibrant-pink font-bold">{task.volunteer?.name || 'Assigned Vendor'}</span>
                                        </p>

                                        <div className="flex items-center gap-2 mb-6">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.userConfirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-vibrant-neon/10 text-vibrant-neon'}`}>
                                                {task.userConfirmed ? 'You Confirmed' : 'Confirmation Needed'}
                                            </span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${task.volunteerConfirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                                                {task.volunteerConfirmed ? 'Volunteer Ready' : 'Awaiting Volunteer'}
                                            </span>
                                        </div>

                                        {task.status === 'accepted' && (
                                            <button
                                                onClick={() => handleFinishTask(task._id)}
                                                disabled={task.userConfirmed}
                                                className={`w-full py-3 font-black rounded-2xl transition-all flex items-center justify-center gap-2 ${task.userConfirmed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-vibrant-neon text-midnight-950 shadow-glow-neon'}`}
                                            >
                                                <Zap className="w-4 h-4 fill-current" /> {task.userConfirmed ? 'Confirmed' : 'Finish & Confirm'}
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Trending Section */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Zap className="text-vibrant-pink animate-pulse" /> Community Spotlight
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.length > 0 ? (
                            <>
                                {/* Featured Service */}
                                <motion.div
                                    whileHover={{ y: -8 }}
                                    className="relative col-span-1 md:col-span-2 h-[300px] rounded-[2.5rem] overflow-hidden group cursor-pointer"
                                    onClick={() => handleRequestClick(services[0])}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-vibrant-pink opacity-80" />
                                    <div className="relative h-full p-10 flex flex-col justify-end">
                                        <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white border border-white/20">
                                            FEATURED SKILL
                                        </div>
                                        <h3 className="text-4xl font-black text-white mb-2 leading-tight">{services[0].title}</h3>
                                        <p className="text-indigo-100 max-w-md line-clamp-2 mb-6 opacity-80">{services[0].description}</p>
                                        <button className="bg-white text-indigo-900 font-bold px-8 py-3 rounded-2xl hover:scale-105 transition-transform w-fit">
                                            Request Trade
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Second Featured Service */}
                                {services[1] && (
                                    <motion.div
                                        whileHover={{ y: -8 }}
                                        onClick={() => handleRequestClick(services[1])}
                                        className="relative h-[300px] rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/10"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-vibrant-cyan to-accent opacity-90" />
                                        <div className="relative h-full p-8 flex flex-col justify-between">
                                            <span className="self-start px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-white uppercase">{services[1].category}</span>
                                            <div>
                                                <h3 className="text-2xl font-black text-white mb-2">{services[1].title}</h3>
                                                <button className="w-full bg-midnight-950/40 backdrop-blur-md text-white border border-white/20 font-bold py-3 rounded-2xl hover:bg-midnight-950 transition-colors shadow-xl">
                                                    Check Details
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="col-span-3 text-center py-10 text-slate-500 italic">
                                Loading community spotlight...
                            </div>
                        )}
                    </div>
                </section>

                {/* Main Content Area */}
                <section>
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Available Services</h2>
                            <p className="text-slate-500">Showing {services.length} services for your selection.</p>
                        </div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {services?.filter(Boolean).map((service) => (
                            <ServiceCard key={service._id} service={service} onRequest={handleRequestClick} />
                        ))}
                    </motion.div>

                    {services.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <Sparkles className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-500 text-xl font-medium">No services found in this category.</p>
                            <button
                                onClick={() => setActiveCategory('All')}
                                className="mt-4 text-accent hover:underline font-bold"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </section>

                {/* Modal Logic */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-midnight-950/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card-vibrant p-8 max-w-md w-full relative z-10 rounded-[2.5rem] border-accent/30 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vibrant-cyan via-accent to-vibrant-pink" />

                                <h2 className="text-2xl font-bold text-white mb-2">Request Service</h2>
                                <p className="text-vibrant-cyan font-bold mb-6 text-sm">{selectedService?.title}</p>

                                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-xl mb-6 border border-red-500/20 text-sm">{error}</div>}
                                {success && <div className="bg-vibrant-neon/10 text-vibrant-neon p-3 rounded-xl mb-6 border border-vibrant-neon/20 text-sm">{success}</div>}

                                <form onSubmit={handleRequestSubmit}>
                                    <div className="flex gap-4 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setRequestMode('coins')}
                                            className={`flex-1 py-3 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${requestMode === 'coins' ? 'bg-vibrant-cyan text-midnight-950 border-vibrant-cyan shadow-glow-cyan' : 'bg-white/5 text-slate-500 border-white/10'}`}
                                        >
                                            Coin Reward
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (selectedService?.allowSkillSwap) {
                                                    setRequestMode('swap');
                                                } else {
                                                    alert('This service does not support skill swapping.');
                                                }
                                            }}
                                            className={`flex-1 py-3 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all ${requestMode === 'swap' ? 'bg-vibrant-pink text-white border-vibrant-pink shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-white/5 text-slate-500 border-white/10'}`}
                                        >
                                            Skill Swap
                                        </button>
                                    </div>

                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 h-32 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder:text-slate-500"
                                        placeholder={requestMode === 'swap' ? "What skill can you offer in return?" : "Add a personalized message..."}
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        required
                                    ></textarea>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-4 rounded-2xl text-slate-400 hover:text-white font-bold transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn-vibrant flex-1 py-4"
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Review Modal */}
                <AnimatePresence>
                    {showReviewModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowReviewModal(false)}
                                className="absolute inset-0 bg-midnight-950/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-card-vibrant p-8 max-w-md w-full relative z-10 rounded-[2.5rem] border-vibrant-neon/30 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-vibrant-neon to-accent" />

                                <h2 className="text-2xl font-bold text-white mb-2">Rate your Experience</h2>
                                <p className="text-slate-400 mb-6 text-sm">How was the skill exchange? Your feedback helps the community.</p>

                                <form onSubmit={handleReviewSubmit}>
                                    <div className="mb-6">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                    className={`p-2 rounded-lg transition-all ${reviewData.rating >= star ? 'text-accent' : 'text-slate-600'}`}
                                                >
                                                    <Star className={`w-8 h-8 ${reviewData.rating >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Comment</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-24 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder:text-slate-500"
                                            placeholder="What did you think of the service?"
                                            value={reviewData.comment}
                                            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowReviewModal(false)}
                                            className="flex-1 px-6 py-4 rounded-2xl text-slate-400 hover:text-white font-bold transition-colors"
                                        >
                                            Skip
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={reviewSubmitting}
                                            className="btn-vibrant flex-1 py-4 bg-gradient-to-r from-vibrant-neon to-accent border-none flex items-center justify-center gap-2"
                                        >
                                            {reviewSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div >
    );
};

export default UserDashboard;
