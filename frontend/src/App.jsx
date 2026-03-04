import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserDashboard from './components/user/UserDashboard';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Wallet from './pages/Wallet';
import Leaderboard from './pages/Leaderboard';
import PageTransition from './components/common/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'volunteer', 'admin']} />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-midnight-950 font-sans text-slate-200">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
