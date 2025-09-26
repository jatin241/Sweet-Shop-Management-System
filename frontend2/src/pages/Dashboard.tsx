import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Navbar from '@/components/Navbar';
import SweetCard, { Sweet } from '@/components/SweetCard';
import WelcomeCard from '@/components/WelcomeCard';
import { useToast } from '@/components/ui/toast-provider';
import { sweetsAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch sweets
  const fetchSweets = async () => {
    setIsLoading(true);
    try {
      const response = await sweetsAPI.getAll();
      setSweets(response.data);
      setFilteredSweets(response.data);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Failed to load sweets',
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...sweets];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(sweet => 
        sweet.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(filters.maxPrice));
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(sweet => sweet.stock > 0);
    }

    setFilteredSweets(filtered);
  }, [sweets, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  ) || searchQuery !== '';

  const categories = [...new Set(sweets.map(sweet => sweet.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-candy">
        <Navbar />
        <div className="flex items-center justify-center min-h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-3"
          >
            <Loader2 className="w-8 h-8 text-primary" />
            <span className="text-lg font-semibold">Loading sweet treats...</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-candy">
      <Navbar onSearch={handleSearch} searchQuery={searchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Sweet Collection</h1>
            <p className="text-muted-foreground">
              Discover our delicious selection of {filteredSweets.length} sweets
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="glass-morphism border-white/20 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </motion.div>
            )}
            
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline"
                  className="glass-morphism border-white/20 hover:bg-accent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-morphism border-white/20">
                <SheetHeader>
                  <SheetTitle>Filter Sweets</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger className="glass-morphism border-white/20">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minPrice">Min Price</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="$0"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="glass-morphism border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice">Max Price</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="$100"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="glass-morphism border-white/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="rounded border-white/20"
                    />
                    <Label htmlFor="inStock">In stock only</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>

        {/* Sweet Cards Grid */}
        <AnimatePresence>
          {filteredSweets.length === 0 ? (
            sweets.length === 0 ? (
              <WelcomeCard />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Card className="glass-morphism border-white/20 max-w-md mx-auto">
                  <CardContent className="p-8">
                    <div className="text-6xl mb-4">🍭</div>
                    <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find more delicious treats!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredSweets.map((sweet, index) => (
                <motion.div
                  key={sweet._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SweetCard sweet={sweet} onUpdate={fetchSweets} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;