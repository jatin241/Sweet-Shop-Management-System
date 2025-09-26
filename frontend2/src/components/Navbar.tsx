import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, LogOut, ShoppingBag, Plus, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { getStoredUser, clearAuthData, isAdmin } from '@/lib/auth';
import { useNavigate, Link } from 'react-router-dom';

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, searchQuery = '' }) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const user = getStoredUser();
  const adminUser = isAdmin();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-morphism border-b border-white/20 p-4 sticky top-0 z-40"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-candy rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-candy bg-clip-text text-transparent">
                Sweet Shop
              </h1>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          </motion.div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for sweets..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 glass-morphism border-white/20 focus:border-primary"
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {adminUser && (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate('/admin/add')}
                className="glass-morphism border-white/20 hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sweet
              </Button>
            </motion.div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="cursor-pointer border-2 border-white/20">
                  <AvatarFallback className="bg-gradient-candy text-white">
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="glass-morphism border-white/20 min-w-48"
            >
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {adminUser && (
                  <p className="text-xs text-primary font-medium">Administrator</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              {adminUser && (
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => navigate('/admin')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;