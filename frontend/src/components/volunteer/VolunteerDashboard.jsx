import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, X, Clock, MapPin, Briefcase, Award, Zap, Star, Loader2, Sparkles, Image as ImageIcon, CheckCircle } from 'lucide-react';
import serviceService from '../../services/service.service';
import requestService from '../../services/request.service';
import reviewService from '../../services/review.service';
import api from '../../services/api';
import AuthContext from '../../context/AuthContext';
import Loader from '../common/Loader';

const VolunteerDashboard = () => {
    const { user, refreshUser } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        category: 'Tech',
        points: '',
        location: '',
        allowSkillSwap: false
    });

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [requestsData, servicesData] = await Promise.all([
                requestService.getRequests('volunteer'),
                serviceService.getServices({ provider: user?._id })
            ]);

            setServices(servicesData || []);
            setRequests(requestsData || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '', serviceId: '', reviewee: '' });

    const handleRequestStatus = async (requestId, status) => {
        try {
            const request = requests.find(r => r._id === requestId);
            await requestService.updateRequestStatus(requestId, status);
            await fetchData();
            await refreshUser();

            if (status === 'completed') {
                setReviewData({
                    ...reviewData,
                    serviceId: request.service._id,
                    reviewee: request.requester._id
                });
                setShowReviewModal(true);
            }
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update request');
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewSubmitting(true);
        try {
            await reviewService.addReview(reviewData);
            setShowReviewModal(false);
            alert('Review submitted!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const created = await serviceService.createService(newService);
            setServices([created, ...services]);
            setShowCreateModal(false);
            setNewService({ title: '', description: '', category: 'Tech', points: '', location: '', allowSkillSwap: false });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to offer skill');
        } finally {
            setSubmitting(false);
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
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-midnight-950 pb-20 pt-10 px-4 md:px-6">
            <div className="container mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                            Volunteer <span className="text-accent underline decoration-vibrant-pink">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">Manage your skills and incoming requests with style.</p>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="btn-vibrant group w-full md:w-auto py-4 px-8"
                    >
                        <Plus className="w-5 h-5 mr-2 inline group-hover:rotate-180 transition-transform duration-500" />
                        Offer New Skill
                    </motion.button>
                </header>

                <div className="grid lg:grid-cols-3 gap-8 md:gap-10">
                    {/* Stats Section */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-1 space-y-4 md:space-y-6"
                    >
                        <motion.div variants={itemVariants} className="glass-card-vibrant p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Award className="w-16 h-16 text-vibrant-pink" />
                            </div>
                            <h3 className="text-slate-400 font-medium mb-1">Total Impact</h3>
                            <div className="text-4xl font-bold text-white flex items-end gap-2 text-shadow-glow">
                                {user?.balance || 0} <span className="text-sm text-vibrant-pink mb-1 font-bold">PTS</span>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-card-vibrant p-6 rounded-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Briefcase className="w-16 h-16 text-accent" />
                            </div>
                            <h3 className="text-slate-400 font-medium mb-1">Active Services</h3>
                            <div className="text-4xl font-bold text-white">{services.length}</div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="glass-card-vibrant p-6 rounded-3xl relative overflow-hidden group border-vibrant-neon/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star className="w-16 h-16 text-vibrant-neon" />
                            </div>
                            <h3 className="text-slate-400 font-medium mb-1">Success Rate</h3>
                            <div className="text-4xl font-bold text-white">98%</div>
                        </motion.div>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Services Grid */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-vibrant-cyan" /> My Offered Services
                            </h2>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid sm:grid-cols-2 gap-6"
                            >
                                {services?.filter(Boolean).map((service, idx) => (
                                    <motion.div
                                        key={service._id || service.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -5 }}
                                        className="glass-card-vibrant p-6 rounded-3xl group"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                                {service.category}
                                            </span>
                                            <div className="text-vibrant-cyan font-bold tabular-nums">
                                                {service.points} pts
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-vibrant-cyan transition-colors">
                                            {service.title}
                                        </h3>
                                        <div className="flex items-center text-slate-400 text-sm gap-4">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {service.location}
                                            </span>
                                            <span className="flex items-center gap-1 text-vibrant-neon">
                                                <div className="w-2 h-2 rounded-full bg-vibrant-neon animate-pulse" /> {service.status || 'Active'}
                                            </span>
                                            {service.allowSkillSwap && (
                                                <span className="flex items-center gap-1 text-vibrant-pink text-xs font-black uppercase tracking-tighter bg-vibrant-pink/10 px-2 py-0.5 rounded-full border border-vibrant-pink/20">
                                                    <Zap className="w-3 h-3" /> Swap
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </section>

                        {/* Pending Requests */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="w-6 h-6 text-vibrant-pink" /> Pending Requests
                            </h2>
                            <AnimatePresence>
                                {requests.filter(req => req && req.status === 'pending').length === 0 ? (
                                    <motion.p
                                        key="empty-req"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-500 italic text-center py-10"
                                    >
                                        Everything is up to date! No pending requests.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        key="req-list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                    >
                                        {requests?.filter(req => req && req.status === 'pending').map(request => (
                                            <motion.div
                                                key={request._id}
                                                variants={itemVariants}
                                                layout
                                                className="glass-card-vibrant p-6 rounded-3xl border-white/5 hover:border-white/10 transition-all"
                                            >
                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white group-hover:text-vibrant-cyan transition-colors">
                                                            {request.service?.title || 'Deleted Service'}
                                                        </h3>
                                                        <p className="text-slate-500 text-sm mt-1">
                                                            from <span className="text-vibrant-pink font-bold">{request.requester?.name || 'Unknown User'}</span>
                                                        </p>
                                                        {request.message && (
                                                            <p className="text-slate-400 text-xs italic mt-2 bg-white/5 p-3 rounded-xl border border-white/5">
                                                                "{request.message}"
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRequestStatus(request._id, 'accepted')}
                                                            className="flex-1 md:flex-none p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-glow-emerald border border-emerald-500/20"
                                                            title="Accept Request"
                                                        >
                                                            <Check className="w-6 h-6" />
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRequestStatus(request._id, 'rejected')}
                                                            className="flex-1 md:flex-none p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-glow-red border border-red-500/20"
                                                            title="Reject Request"
                                                        >
                                                            <X className="w-6 h-6" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Active Engagements */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-vibrant-neon animate-pulse" /> Active Engagements
                            </h2>
                            <AnimatePresence>
                                {requests.filter(req => req && req.status === 'accepted').length === 0 ? (
                                    <motion.p
                                        key="empty-active"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-500 italic text-center py-10 bg-white/5 rounded-3xl border border-white/5"
                                    >
                                        No active tasks in progress.
                                    </motion.p>
                                ) : (
                                    <motion.div
                                        key="active-list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                    >
                                        {requests?.filter(req => req && req.status === 'accepted').map(request => (
                                            <motion.div
                                                key={request._id}
                                                variants={itemVariants}
                                                layout
                                                className="glass-card-vibrant p-6 rounded-3xl border-vibrant-neon/30 bg-vibrant-neon/5"
                                            >
                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-white">
                                                            {request.service?.title || 'Deleted Service'}
                                                        </h3>
                                                        <p className="text-slate-400 text-sm">
                                                            Client: <span className="text-vibrant-cyan font-bold">{request.requester?.name || 'Unknown User'}</span>
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${request.volunteerConfirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-vibrant-neon/10 text-vibrant-neon'}`}>
                                                                {request.volunteerConfirmed ? 'You Confirmed' : 'Your Action Required'}
                                                            </span>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${request.userConfirmed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
                                                                {request.userConfirmed ? 'Client Confirmed' : 'Awaiting Client'}
                                                            </span>
                                                            {request.mode === 'swap' && (
                                                                <span className="text-[10px] font-black uppercase tracking-widest bg-vibrant-pink/10 text-vibrant-pink px-2 py-0.5 rounded border border-vibrant-pink/20">Skill Swap</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            disabled={request.volunteerConfirmed}
                                                            onClick={() => handleRequestStatus(request._id, 'completed')}
                                                            className={`flex-1 md:flex-none px-6 py-3 font-black rounded-2xl transition-all flex items-center gap-2 ${request.volunteerConfirmed ? 'bg-slate-800 text-slate-500 cursor-default' : 'bg-vibrant-neon text-midnight-950 shadow-glow-neon shadow-vibrant-neon/40'}`}
                                                        >
                                                            <CheckCircle className="w-5 h-5" /> {request.volunteerConfirmed ? 'Confirmed' : 'Complete & Confirm'}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Completed History */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-emerald-400" /> Completed History
                            </h2>
                            <div className="space-y-4">
                                {requests?.filter(r => r && r.status === 'completed').length === 0 ? (
                                    <p className="text-slate-500 italic text-center py-6 bg-white/5 rounded-3xl border border-white/5">
                                        No completed tasks yet. Keep up the great work!
                                    </p>
                                ) : (
                                    requests?.filter(r => r && r.status === 'completed').map(request => (
                                        <motion.div
                                            key={request._id}
                                            variants={itemVariants}
                                            className="glass-card-vibrant p-6 rounded-3xl border-emerald-500/10 bg-emerald-500/5"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{request.service?.title || 'Deleted Service'}</h3>
                                                    <p className="text-slate-500 text-sm">
                                                        Completed by <span className="text-emerald-400 font-bold">{request.requester?.name || 'Unknown User'}</span>
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-400/10 px-3 py-1 rounded-full">Success</span>
                                                    <span className="text-slate-500 text-[10px] mt-2 italic">
                                                        {new Date(request.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* Create Service Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-midnight-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-card-vibrant p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] overflow-y-auto max-h-[90vh] no-scrollbar shadow-glow-cyan/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent via-vibrant-pink to-vibrant-cyan" />

                            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
                                <Sparkles className="text-vibrant-pink w-6 h-6 md:w-8 md:h-8" /> Offer New Skill
                            </h2>
                            <p className="text-slate-400 mb-6 md:mb-8 font-light text-sm">Share your expertise with the community.</p>

                            <form onSubmit={handleCreateService} className="space-y-4 md:space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Skill Title</label>
                                        <input
                                            required
                                            type="text"
                                            className="input-field py-3 md:py-4"
                                            placeholder="e.g. Advanced React Mentoring"
                                            value={newService.title}
                                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Category</label>
                                        <select
                                            className="input-field py-3 md:py-4 appearance-none cursor-pointer"
                                            value={newService.category}
                                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                                        >
                                            <option>Tech</option>
                                            <option>Home</option>
                                            <option>Education</option>
                                            <option>Wellness</option>
                                            <option>Creative</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Points Reward</label>
                                        <input
                                            required
                                            type="number"
                                            className="input-field py-3 md:py-4"
                                            placeholder="50"
                                            value={newService.points}
                                            onChange={(e) => setNewService({ ...newService, points: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 mt-2">
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-white">Allow Skill Swap</h4>
                                            <p className="text-[10px] text-slate-500">Users can offer skills instead of coins.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewService({ ...newService, allowSkillSwap: !newService.allowSkillSwap })}
                                            className={`w-12 h-6 rounded-full relative transition-colors ${newService.allowSkillSwap ? 'bg-vibrant-neon' : 'bg-slate-700'}`}
                                        >
                                            <motion.div
                                                animate={{ x: newService.allowSkillSwap ? 24 : 2 }}
                                                className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-lg"
                                            />
                                        </button>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Location</label>
                                        <input
                                            required
                                            type="text"
                                            className="input-field py-3 md:py-4"
                                            placeholder="e.g. Remote or Downtown"
                                            value={newService.location}
                                            onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Description</label>
                                        <textarea
                                            required
                                            className="input-field py-3 md:py-4 min-h-[80px] md:min-h-[100px] resize-none"
                                            placeholder="Describe what you're offering..."
                                            value={newService.description}
                                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-4 text-slate-400 font-bold hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="btn-vibrant flex-1 flex justify-center items-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                                        {submitting ? 'Creating...' : 'Launch Skill'}
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

                            <h2 className="text-2xl font-bold text-white mb-2">Rate Client Performance</h2>
                            <p className="text-slate-400 mb-6 text-sm">How was working with this client? Your feedback helps the community.</p>

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
                                    <label className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1 mb-2 block">Public Comment</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 h-24 focus:outline-none focus:ring-2 focus:ring-accent transition-all text-white placeholder:text-slate-500"
                                        placeholder="Add a testimonial or feedback..."
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
    );
};

export default VolunteerDashboard;
