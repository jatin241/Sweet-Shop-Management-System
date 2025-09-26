import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Edit, Trash2, Plus, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from './ui/toast-provider';
import { sweetsAPI } from '@/lib/api';
import { isAdmin } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export interface Sweet {
  _id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  rating?: number;
  createdAt?: string;
}

interface SweetCardProps {
  sweet: Sweet;
  onUpdate?: () => void;
}

const SweetCard: React.FC<SweetCardProps> = ({ sweet, onUpdate }) => {
  const [isFlying, setIsFlying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const adminUser = isAdmin();

  const handlePurchase = async () => {
    if (sweet.stock === 0) return;
    
    setIsLoading(true);
    try {
      await sweetsAPI.purchase(sweet._id);
      
      // Trigger flying candy animation
      setIsFlying(true);
      setTimeout(() => setIsFlying(false), 1000);
      
      showToast({
        type: 'success',
        title: 'Sweet Purchased! 🍭',
        description: `You bought ${sweet.name} for $${sweet.price}`,
      });
      
      onUpdate?.();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Purchase Failed',
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!adminUser) return;
    
    if (!confirm(`Are you sure you want to delete ${sweet.name}?`)) return;
    
    try {
      await sweetsAPI.delete(sweet._id);
      showToast({
        type: 'success',
        title: 'Sweet Deleted',
        description: `${sweet.name} has been removed from the shop`,
      });
      onUpdate?.();
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      chocolate: 'bg-amber-500',
      candy: 'bg-pink-500',
      cake: 'bg-purple-500',
      donut: 'bg-orange-500',
      cookie: 'bg-yellow-500',
      gummy: 'bg-green-500',
      default: 'bg-primary',
    };
    return colors[category.toLowerCase() as keyof typeof colors] || colors.default;
  };

  const isOutOfStock = sweet.stock === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <Card className="glass-morphism border-white/20 hover:shadow-candy transition-all duration-300 overflow-hidden group">
        {/* Sold Out Ribbon */}
        {isOutOfStock && (
          <div className="absolute top-4 -right-8 bg-destructive text-destructive-foreground px-8 py-1 text-sm font-semibold transform rotate-45 z-10">
            Sold Out
          </div>
        )}

        {/* Flying Candy Animation */}
        <AnimatePresence>
          {isFlying && (
            <motion.div
              initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ 
                opacity: 0, 
                scale: 0.3, 
                x: 200, 
                y: -200, 
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-4xl"
            >
              🍭
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader className="relative p-0">
          <div className="aspect-square relative overflow-hidden">
            <img
              src={sweet.image || `/api/placeholder/300/300?text=${encodeURIComponent(sweet.name)}`}
              alt={sweet.name}
              className={`
                w-full h-full object-cover transition-transform duration-300 group-hover:scale-110
                ${isOutOfStock ? 'grayscale' : ''}
              `}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Category Badge */}
            <Badge className={`absolute top-3 left-3 ${getCategoryColor(sweet.category)} text-white`}>
              {sweet.category}
            </Badge>

            {/* Rating */}
            {sweet.rating && (
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {sweet.rating.toFixed(1)}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight">{sweet.name}</h3>
            {sweet.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {sweet.description}
              </p>
            )}
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-primary">
                ${sweet.price.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Stock: <span className={`font-semibold ${isOutOfStock ? 'text-destructive' : 'text-success'}`}>
                  {sweet.stock}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 gap-2">
          <Button
            onClick={handlePurchase}
            disabled={isOutOfStock || isLoading}
            className={`
              flex-1 bounce-transition
              ${isOutOfStock 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-gradient-candy hover:bg-gradient-sunset text-white hover:scale-105'
              }
            `}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isLoading ? 'Purchasing...' : isOutOfStock ? 'Sold Out' : 'Purchase'}
          </Button>

          {adminUser && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/admin/edit/${sweet._id}`)}
                className="glass-morphism border-white/20 hover:bg-accent"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="glass-morphism border-white/20 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SweetCard;