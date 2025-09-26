// Modern Navbar component ported from frontend2, adapted for dark/black theme
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Removed search handler

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-morphism border-b border-white/20 p-4 sticky top-0 z-40 bg-black/80"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-cyan-900 rounded-full flex items-center justify-center shadow-neon">
              <ShoppingBag className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-cyan-400 drop-shadow-neon">Sweet Shop</h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </motion.div>
        </Link>
        {/* User Menu */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-white font-semibold">{user}</span>
              <button onClick={handleLogout} className="text-cyan-400 hover:text-cyan-200 font-bold ml-2">Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="text-cyan-400 hover:text-cyan-200 font-bold">Login</button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
