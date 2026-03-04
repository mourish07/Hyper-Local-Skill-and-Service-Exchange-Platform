import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        ...(user ? [
            { name: 'Dashboard', path: `/${user.role}/dashboard` },
            { name: 'Wallet', path: '/wallet' },
            { name: 'Leaderboard', path: '/leaderboard' }
        ] : [])
    ];

    return (
        <nav className="sticky top-0 z-50 bg-midnight-950/80 backdrop-blur-lg border-b border-midnight-800">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <Link to={user ? `/${user.role}/dashboard` : "/"} className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-white font-bold">S</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            SkillConnect
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative text-sm font-medium transition-colors duration-300 ${location.pathname === link.path ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-slate-400">
                                    <span className="hidden sm:inline">Hi, </span>
                                    <span className="text-slate-200 font-medium">{user.name}</span>
                                </div>
                                <button
                                    onClick={onLogout}
                                    className="text-sm text-slate-400 hover:text-red-400 transition-colors duration-300"
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary py-1.5 px-4 text-sm"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
