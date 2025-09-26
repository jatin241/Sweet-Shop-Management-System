import React, { useEffect, useState } from "react";
import { Link, BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css"; // Assuming this is where custom floating-candy/watermark styles are defined
import { CartProvider, useCart } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { fetchSweets, purchaseSweet } from "./services/api";

import { Toaster, toast } from "sonner";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Dashboard from "./Dashboard";

// --- START: Refactored Components ---

// Simple Navbar implementation (matches image style)
function SimpleNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-sm shadow-xl text-sm py-4">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">
        
        {/* Brand / Logo (Using 'ReadymadeUI' inspired style) */}
				<Link 
					to="/" 
					className="flex items-center gap-2 font-bold text-2xl text-white hover:text-purple-400 transition focus:outline-none"
					aria-label="SoSweet"
				>
					<span className="text-3xl font-extrabold text-purple-600">S</span> 
					<span className="tracking-wider">SoSweet</span>
				</Link>

        {/* Links */}
        <div className="flex flex-row items-center gap-8">
          <Link 
            to="/" 
            className="font-medium text-gray-400 hover:text-white transition"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="font-medium text-gray-400 hover:text-white transition"
          >
            Sweets
          </Link>
					{/* Cart link removed from navbar as requested */}
          
          {user ? (
            <>
              <span className="font-semibold text-gray-200 hidden sm:inline">{user}</span>
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition shadow-lg"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

function HomeHero() {
  // Refactoring Hero to match the image's structure
  return (
    <div className="w-full flex flex-col items-center pt-24 pb-32 relative bg-black" style={{ minHeight: 600 }}>
      {/* Background effect - using the existing faint background for a dark aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a051a] to-black opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-10 z-0"></div> {/* Placeholder for subtle background pattern */}
        
      <motion.div
        className="flex flex-col items-center w-full z-10 max-w-4xl px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-center text-white leading-tight mb-6">
          <span className="block">Indulge Your</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Sweet Cravings</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 text-center max-w-2xl">
          Discover artisanal sweets: crafted with passion, delivered with care. The best things in life are warm, custard, and topped with delicious cream.
        </p>

				{/* Removed stats and action buttons as requested */}
      </motion.div>

      {/* New section for InfoCards below the hero for separation, using a section heading */}
      <section className="w-full max-w-6xl mx-auto py-16 z-10">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Why Choose SoSweet?</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <InfoCard icon="✨" title="Artisanal Quality" desc="Hand-crafted daily using the finest, freshest ingredients." />
          <InfoCard icon="🚚" title="Fast Delivery" desc="Sweets delivered from our oven to your door in hours." />
          <InfoCard icon="🔒" title="Secure Packing" desc="Enjoy peace of mind with our secure, eco-friendly packaging." />
        </div>
      </section>
    </div>
  );
}

function StatBlock({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center mx-4">
      <div className="text-4xl font-extrabold text-cyan-400 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-400">{label}</div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  // Refactored InfoCard for dark, professional style
  return (
    <motion.div
      className="flex flex-col items-center bg-[#150515] rounded-xl px-6 py-6 shadow-2xl border border-purple-900 w-64 hover:border-purple-600 transition-all duration-300"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px 0 rgba(128, 0, 128, 0.3)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-4xl mb-3">{icon}</span>
      <span className="font-bold text-white text-xl mb-2">{title}</span>
      <span className="text-gray-400 text-center text-sm">{desc}</span>
    </motion.div>
  );
}

function SweetCard({ sweet }: { sweet: Sweet }) {
	const [quantity, setQuantity] = useState(sweet.quantity ?? 0);
	const [loading, setLoading] = useState(false);

	async function handlePurchase() {
		if (quantity <= 0) return toast.error("Out of stock!");
		setLoading(true);
		try {
			await purchaseSweet(sweet._id, 1);
			setQuantity(q => q - 1);
			toast.success(`Purchased 1 ${sweet.name}!`);
		} catch (e) {
			toast.error("Purchase failed. Please try again.");
		} finally {
			setLoading(false);
		}
	}
	return (
		<motion.div
			className="bg-[#1a0a1a] rounded-2xl shadow-xl flex flex-col items-center p-5 relative group border border-purple-900"
			whileHover={{ scale: 1.03, boxShadow: "0 10px 30px 0 rgba(128, 0, 128, 0.3)" }}
			transition={{ type: 'spring', stiffness: 300 }}
		>
			<img 
				src={sweet.img} 
				alt={sweet.name} 
				className="w-full h-40 object-cover rounded-xl mb-4 border-4 border-purple-600/50 group-hover:border-purple-500 transition-colors duration-200" 
			/>
			<div className="text-white text-xl font-bold mb-1 text-center">{sweet.name}</div>
			{sweet.category && <div className="text-xs text-purple-300 mb-2 font-medium">{sweet.category}</div>}
			<div className="text-gray-400 text-sm mb-3 text-center min-h-[40px]">{sweet.desc}</div>
			<div className="flex items-center justify-between w-full mt-auto pt-2 border-t border-purple-800">
				<span className="text-cyan-400 font-extrabold text-2xl">${sweet.price}</span>
				<motion.button
					whileTap={{ scale: 0.9 }}
					className="ml-auto px-4 py-2 bg-purple-600 text-white font-bold rounded-full shadow-lg text-lg hover:bg-purple-700 transition-colors disabled:opacity-60"
					onClick={handlePurchase}
					disabled={loading || quantity <= 0}
				>
					{loading ? "Processing..." : "Purchase"}
				</motion.button>
			</div>
			{typeof quantity === 'number' && (
				<div className="absolute top-3 right-3 bg-cyan-400 text-gray-900 text-xs px-3 py-1 rounded-full font-extrabold shadow-md">
					{quantity} left
				</div>
			)}
		</motion.div>
	);
}

function MenuGrid() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

	useEffect(() => {
		fetchSweets()
			.then((data) => {
				// Debug: log all sweet names to help with image mapping
				console.log('Sweet names from API:', data.map((s: Sweet) => s.name));
				setSweets(data);
			})
			.catch(() => setError("Failed to load sweets."))
			.finally(() => setLoading(false));
	}, []);

  if (loading) return <div className="text-center text-purple-400 mt-16 text-xl">Loading delicious sweets...</div>;
  if (error) return <div className="text-center text-red-400 mt-16 text-xl">{error}</div>;

	// Map sweet names to public images
		const sweetImages: Record<string, string> = {
			'Gulab Jamun': '/GulabJamun.jpg',
			'GulabJamun': '/GulabJamun.jpg',
			'Rasmalai': '/Rasmalai.jpg',
			'ChamCham': '/ChamCham.jpeg',
			// Add more mappings as needed
		};

	return (
		<div className="w-full max-w-6xl mx-auto py-16 px-4">
			<h2 className="text-4xl font-extrabold text-center text-white mb-12">Our Sweet Selection</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{sweets.map((sweet: Sweet) => {
					const img = sweetImages[sweet.name] || sweet.img;
					return <SweetCard key={sweet._id || sweet.name} sweet={{ ...sweet, img }} />;
				})}
			</div>
		</div>
	);
}


// (Other helper components are not strictly needed in the main file but are kept here)
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-black/50 rounded-lg m-8">
      <h2 className="text-4xl font-bold text-purple-400 mb-4">{title}</h2>
      <p className="text-lg text-gray-400">This page is under construction.</p>
    </div>
  );
}

// --- END: Refactored Components ---

// Types (Kept for completeness)
type Sweet = {
  _id?: string;
  name: string;
  desc?: string;
  category?: string;
  price: number;
  quantity?: number;
  img: string;
};


// Function components used in Routes
function MenuPage() {
  return (
    <>
      <HomeHero />
      <MenuGrid />
    </>
  );
}


// Main App component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Overall background shifted to deep black with subtle effects */}
          <div className="min-h-screen relative bg-black text-white">
            {/* Large faint sweet watermark background (Kept, assuming it's styled dark in App.css) */}
            <svg className="sweet-watermark-bg" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="450" cy="450" r="420" fill="#2d002d" fillOpacity="0.15" /> {/* Darker Circle */}
              <text x="50%" y="38%" textAnchor="middle" fontSize="180" fill="#a050a0" opacity="0.3" fontFamily="Poppins, Inter, Quicksand">🍩</text>
              <text x="30%" y="65%" textAnchor="middle" fontSize="120" fill="#50a0a0" opacity="0.3">🍬</text>
              <text x="70%" y="70%" textAnchor="middle" fontSize="140" fill="#a050a0" opacity="0.3">🧁</text>
              <text x="60%" y="50%" textAnchor="middle" fontSize="100" fill="#50a0a0" opacity="0.3">🍭</text>
            </svg>
            {/* Floating candy SVGs - Keep the visual effects but ensure they match the dark theme */}
            <svg className="floating-candy candy1" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#9333ea" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍬</text></svg>
            <svg className="floating-candy candy2" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#14b8a6" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍭</text></svg>
            <svg className="floating-candy candy3" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#a855f7" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🧁</text></svg>
            <svg className="floating-candy candy4" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#06b6d4" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍩</text></svg>
            
            <Toaster position="top-center" richColors />
            <SimpleNavbar />

            <main>
              <Routes>
                <Route path="/" element={<HomeHero />} />
                {/* Using MenuGrid inside ProtectedRoute to showcase the styled SweetCards */}
                <Route path="/dashboard" element={<ProtectedRoute><MenuGrid /></ProtectedRoute>} /> 
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<Placeholder title="Shopping Cart" />} />
                <Route path="/profile" element={<ProtectedRoute><Placeholder title="User Profile" /></ProtectedRoute>} />
              </Routes>
            </main>

            <AppFooter />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// A simple footer to complete the layout
function AppFooter() {
  return (
    <footer className="bg-black/80 border-t border-purple-900 py-6 mt-16">
      <div className="max-w-[85rem] mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SoSweet. All rights reserved. | <span className="text-purple-400">UI inspired by ReadymadeUI</span>
      </div>
    </footer>
  )
}

// Protects routes from unauthenticated access (unchanged logic)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

export default App;