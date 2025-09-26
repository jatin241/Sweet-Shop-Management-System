import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '@/lib/auth';
import sweetCollection from '@/assets/sweet-collection.jpg';

const WelcomeCard: React.FC = () => {
  const navigate = useNavigate();
  const adminUser = isAdmin();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex justify-center py-16"
    >
      <Card className="glass-morphism border-white/20 max-w-2xl shadow-candy">
        <CardContent className="p-8 text-center">
          <div className="relative mb-6">
            <img 
              src={sweetCollection} 
              alt="Sweet Collection" 
              className="w-64 h-32 object-cover rounded-lg mx-auto opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg" />
          </div>
          
          <div className="space-y-4">
            <div className="text-6xl mb-4">🍭</div>
            <h2 className="text-3xl font-bold bg-gradient-candy bg-clip-text text-transparent">
              Welcome to Sweet Shop!
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your candy store is ready to go! {adminUser ? 'Start by adding some delicious sweets to your collection.' : 'Browse our collection of delicious treats.'}
            </p>
          </div>

          {adminUser && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8"
            >
              <Button
                onClick={() => navigate('/admin/add')}
                className="bg-gradient-candy hover:bg-gradient-sunset text-white font-semibold px-8 py-3 text-lg bounce-transition"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Sweet
              </Button>
            </motion.div>
          )}

          <div className="mt-8 flex justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Easy Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🍬</span>
              <span>Sweet Collection</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📊</span>
              <span>Real-time Stock</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WelcomeCard;