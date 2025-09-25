
import React, { useEffect, useState } from "react";
import { Link, BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";
import { CartProvider, useCart } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { fetchSweets, purchaseSweet } from "./services/api";

import { Toaster, toast } from "sonner";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./Dashboard";

function App() {

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen">
            {/* Floating candy SVGs for immersive background */}
            <svg className="floating-candy candy1" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#ffb6e6" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍬</text></svg>
            <svg className="floating-candy candy2" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#b6ffe0" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍭</text></svg>
            <svg className="floating-candy candy3" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#e0b6ff" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🧁</text></svg>
            <svg className="floating-candy candy4" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#b6e6ff" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍩</text></svg>
            <Toaster position="top-center" richColors />
            <Navbar />
            <Routes>
              <Route path="/" element={<HomeHero />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
// Protects routes from unauthenticated access
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
}

// Types
type Sweet = {
  _id?: string;
  name: string;
  desc?: string;
  category?: string;
  price: number;
  quantity?: number;
  img: string;
};

// Menu page with hero and grid
function MenuPage() {
  return (
    <>
      <HomeHero />
      <MenuGrid />
    </>
  );
}


// ...existing code...
// Types

function MenuGrid() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSweets()
      .then(setSweets)
      .catch(() => setError("Failed to load sweets."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-pink-200 mt-8">Loading sweets...</div>;
  if (error) return <div className="text-center text-red-400 mt-8">{error}</div>;

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {sweets.map((sweet: Sweet) => (
        <SweetCard key={sweet._id || sweet.name} sweet={sweet} />
      ))}
    </div>
  );
}

function SweetCard({ sweet }: { sweet: Sweet }) {
  const { addToCart } = useCart();
  function handleAdd() {
    addToCart({ name: sweet.name, price: sweet.price, img: sweet.img });
    toast.success(`${sweet.name} added to cart!`);
  }
  return (
    <motion.div
      className="bg-[#5e2d2d] rounded-2xl shadow-lg flex flex-col items-center p-4 relative group hover:scale-105 hover:shadow-2xl transition-transform duration-200"
      whileHover={{ scale: 1.07, boxShadow: "0 12px 32px 0 rgba(0,0,0,0.25)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <img src={sweet.img} alt={sweet.name} className="w-32 h-20 object-cover rounded-xl mb-2 border-2 border-pink-200 group-hover:border-pink-400 transition-colors duration-200" />
      <div className="text-pink-100 text-lg font-bold mb-1 text-center">{sweet.name}</div>
      {sweet.category && <div className="text-xs text-pink-300 mb-1">{sweet.category}</div>}
      <div className="text-pink-100 text-sm mb-2 text-center min-h-[40px]">{sweet.desc}</div>
      <div className="flex items-center justify-between w-full mt-auto">
        <span className="text-pink-200 font-bold text-xl">${sweet.price}</span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="ml-auto px-3 py-1 bg-pink-200 text-[#4d2323] font-bold rounded-full shadow text-lg border-2 border-pink-300 hover:bg-pink-300 transition-colors"
          onClick={handleAdd}
        >
          +
        </motion.button>
      </div>
      {typeof sweet.quantity === 'number' && (
        <div className="absolute top-2 right-2 bg-pink-400 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow">
          {sweet.quantity} left
        </div>
      )}
    </motion.div>
  );
}

function HomeHero() {
  // Example sweet info (Rasmalai)
  const sweet = {
    name: "Rasmalai",
    img: "/Rasmalai.jpg",
    desc: "Rasmalai is a soft, spongy dessert made from chenna (Indian cottage cheese) soaked in sweet, thickened milk flavored with cardamom and saffron. A Bengali classic, it's creamy, aromatic, and melts in your mouth.",
    facts: [
      "Origin: Bengal, India",
      "Main ingredients: Chenna, milk, sugar, cardamom, saffron",
      "Served chilled for a refreshing treat",
    ],
  };
  return (
    <div className="w-full flex flex-col items-center pt-10 pb-8">
      <motion.div
        className="flex flex-col items-center w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        {/* Modern sweet pattern section */}
        <section className="sweet-pattern-section mt-2 mb-10">
          <img src={sweet.img} alt={sweet.name} className="sweet-pattern-img" />
          <div className="sweet-pattern-info">
            <div className="sweet-pattern-title">{sweet.name}</div>
            <div className="sweet-pattern-desc">{sweet.desc}</div>
            <ul className="sweet-pattern-facts list-disc pl-5">
              {sweet.facts.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </section>
        <h1 className="mt-2 text-5xl font-extrabold text-yellow-200 tracking-tight text-center" style={{ fontFamily: 'Fredoka One' }}>
          SoSweet
        </h1>
        <p className="mt-4 text-lg text-gray-200 text-center max-w-xl">
          The best things in life are warm, custard and topped with delicious cream
        </p>
        <div className="flex gap-4 mt-8">
          <InfoCard icon="🌾" title="Nutrition rich" desc="Nutrition rich delights, crafted to nourish your taste buds" />
          <InfoCard icon="🍰" title="Unique Recipe" desc="Savouring 100% baked items from our oven to your plate" />
          <InfoCard icon="🥐" title="100%baked" desc="Enjoy peace of mind with our secure packing" />
        </div>
        <a href="/dashboard" className="mt-8 px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg text-lg border-2 border-yellow-300 hover:bg-yellow-500 transition-colors">Go to Dashboard</a>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <motion.div
      className="flex flex-col items-center bg-[#5e2d2d] rounded-2xl px-6 py-4 shadow-md w-56"
      whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-bold text-pink-200 text-lg mb-1">{title}</span>
      <span className="text-pink-100 text-center text-sm">{desc}</span>
    </motion.div>
  );
}

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
];

function Navbar() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { user, logout, token } = useAuth();
  return (
    <motion.nav
      className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md rounded-b-3xl shadow-lg border-b-4 border-pink-200"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: 'spring' }}
    >
      <div className="flex items-center gap-3">
        {/* Candy logo */}
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-pink-200 via-pink-300 to-pink-400 shadow-lg border-2 border-pink-300">
          <span className="text-3xl">🍬</span>
        </span>
        <span className="text-3xl font-extrabold tracking-wider text-pink-400 drop-shadow" style={{ fontFamily: 'Fredoka One' }}>SoSweet</span>
      </div>
      <div className="flex gap-8">
        {navLinks.map(link => (
          <Link key={link.name} to={link.path} className="text-lg font-semibold text-pink-500 hover:text-pink-400 transition-colors duration-200 px-4 py-2 rounded-full hover:bg-pink-100/60">
            {link.name}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-pink-200 via-pink-300 to-pink-400 shadow border-2 border-pink-200">
            <span className="text-2xl">🍩</span>
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-400 text-white text-xs font-bold rounded-full px-2 py-0.5 animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>
        {token ? (
          <>
            {/* Avatar button for logout */}
            <button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="ml-2 flex items-center gap-2 px-3 py-1 bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white rounded-full font-bold shadow hover:scale-105 hover:shadow-lg transition-all text-sm"
            >
              <span className="inline-block w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-xl mr-1 border-2 border-pink-300">🍭</span>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-pink-400 hover:text-pink-500 font-semibold text-sm px-4 py-2 rounded-full bg-pink-100/60 hover:bg-pink-200 transition-all">Login</Link>
        )}
      </div>
    </motion.nav>
  );
}
function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [loading, setLoading] = React.useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      for (const item of cart) {
        await purchaseSweet(item.name, item.quantity);
      }
      toast.success("Purchase successful! Enjoy your sweets 🍰");
      clearCart();
    } catch (e) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-[#5e2d2d] rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-pink-200 mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <div className="text-pink-100 text-center">Your cart is empty.</div>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item.name} className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img src={item.img} alt={item.name} className="w-16 h-12 object-cover rounded-lg border-2 border-pink-200" />
                  <div>
                    <div className="text-pink-100 font-bold">{item.name}</div>
                    <div className="text-pink-200">${item.price}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.name)} className="px-2 py-1 bg-pink-300 text-[#4d2323] rounded-full font-bold hover:bg-pink-400 transition-colors">-</button>
                  <span className="text-pink-100 font-bold">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="px-2 py-1 bg-pink-300 text-[#4d2323] rounded-full font-bold hover:bg-pink-400 transition-colors">+</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-8">
            <span className="text-xl text-pink-200 font-bold">Total: ${total}</span>
            <button onClick={clearCart} className="px-4 py-2 bg-pink-200 text-[#4d2323] rounded-full font-bold hover:bg-pink-300 transition-colors">Clear Cart</button>
            <button
              className="px-6 py-2 bg-pink-400 text-white rounded-full font-bold hover:bg-pink-500 transition-colors ml-4 disabled:opacity-60"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// (duplicate removed)
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <h2 className="text-4xl font-bold text-pink-200 mb-4">{title}</h2>
      <p className="text-lg text-pink-100">This page is under construction.</p>
    </div>
  );
}

export default App;
