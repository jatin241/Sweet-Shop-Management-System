import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/toast-provider';
import { sweetsAPI } from '@/lib/api';
import { isAdmin } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import sweetCollection from '@/assets/sweet-collection.jpg';

const AddSweet: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Check admin access
  React.useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
      showToast({
        type: 'error',
        title: 'Access Denied',
        description: 'Only administrators can add sweets',
      });
    }
  }, [navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await sweetsAPI.create(formDataToSend);
      
      showToast({
        type: 'success',
        title: 'Sweet Added! 🍭',
        description: `${formData.name} has been added to the shop`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Failed to Add Sweet',
        description: error.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-candy">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="glass-morphism border-white/20 hover:bg-accent mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Add New Sweet</h1>
            <p className="text-muted-foreground">
              Create a delicious new treat for your customers
            </p>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-morphism border-white/20 shadow-candy">
              <CardHeader>
                <CardTitle className="text-2xl text-center bg-gradient-candy bg-clip-text text-transparent">
                  Sweet Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label>Sweet Image</Label>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-full h-48 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
                            <p className="text-muted-foreground">
                              Upload a sweet image
                            </p>
                          </div>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="glass-morphism border-white/20"
                      />
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Sweet Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Chocolate Cupcake"
                        className="glass-morphism border-white/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                        required
                      >
                        <SelectTrigger className="glass-morphism border-white/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chocolate">Chocolate</SelectItem>
                          <SelectItem value="candy">Candy</SelectItem>
                          <SelectItem value="cake">Cake</SelectItem>
                          <SelectItem value="donut">Donut</SelectItem>
                          <SelectItem value="cookie">Cookie</SelectItem>
                          <SelectItem value="gummy">Gummy</SelectItem>
                          <SelectItem value="ice cream">Ice Cream</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="A delicious sweet treat that will melt in your mouth..."
                      className="glass-morphism border-white/20 focus:border-primary min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="9.99"
                        className="glass-morphism border-white/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="50"
                        className="glass-morphism border-white/20 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-candy hover:bg-gradient-sunset text-white font-semibold py-3 bounce-transition"
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isLoading ? 'Adding Sweet...' : 'Add Sweet to Shop'}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddSweet;