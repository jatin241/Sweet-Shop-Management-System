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
//import Dashboard from "./Dashboard";

// --- START: Refactored Components ---

// Simple Navbar implementation (matches image style)
function SimpleNavbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-[oklch(from_var(--background)_l_c_h_/_80%)] backdrop-blur-sm shadow-xl text-sm py-4">
      <nav className="max-w-[85rem] w-full mx-auto px-4 flex items-center justify-between">         
        {/* Brand / Logo (Using 'ReadymadeUI' inspired style) */}
				<Link 
					to="/" 
					className="flex items-center gap-2 font-bold text-2xl text-[var(--foreground)] hover:text-[var(--primary)] transition focus:outline-none"
					aria-label="SoSweet"
				>
					<span className="text-3xl font-extrabold text-[var(--primary)]">S</span> 
					<span className="tracking-wider">SoSweet</span>
				</Link>

        {/* Links */}
        <div className="flex flex-row items-center gap-8">
          <Link 
            to="/" 
            className="font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
          >
            Sweets
          </Link>
					{/* Cart link removed from navbar as requested */}
          
          {user ? (
            <>
              <span className="font-semibold text-[var(--foreground)] hidden sm:inline">{user}</span>
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)] transition shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-[var(--radius)] bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)] transition shadow-lg"
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
           <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--muted)] to-[var(--background)] opacity-90 z-0"></div>      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-10 z-0"></div> {/* Placeholder for subtle background pattern */}
        
      <motion.div
        className="flex flex-col items-center w-full z-10 max-w-4xl px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-center text-white leading-tight mb-6">
          <span className="block">Indulge Your</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Sweet Cravings</span>        </h1>
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
          <div className="text-4xl font-extrabold text-[var(--accent)] mb-1">{value}</div>      <div className="text-sm font-medium text-gray-400">{label}</div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  // Refactored InfoCard for dark, professional style
    return (
      <motion.div
        className="flex flex-col items-center bg-[var(--muted)] rounded-xl px-6 py-6 shadow-2xl border border-[var(--sidebar-border)] w-64 hover:border-[var(--primary)] transition-all duration-300"
        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px 0 oklch(from var(--primary) l c h / 0.3)" }}
        transition={{ type: 'spring', stiffness: 300 }}
      >      <span className="text-4xl mb-3">{icon}</span>
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
      setQuantity((q) => q - 1);
      toast.success(`Purchased 1 ${sweet.name}!`);
    } catch (e) {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      className="group relative bg-gradient-to-br from-[var(--muted)] via-[var(--background)] to-[var(--muted)] 
                 rounded-3xl shadow-2xl p-5 border border-[var(--sidebar-border)] 
                 overflow-hidden backdrop-blur-md"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Subtle glowing border on hover */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[oklch(from var(--primary) l c h / 20%)] to-[oklch(from var(--accent) l c h / 20%)] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>

      {/* Sweet image */}
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
        <img
          src={sweet.img}
          alt={sweet.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        {typeof quantity === "number" && (
          <span className="absolute top-3 left-3 bg-[oklch(from var(--accent) l c h / 90%)] text-gray-900 text-xs px-3 py-1 rounded-full font-extrabold shadow-md">
            {quantity} left
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col">
        <h3 className="text-white text-lg font-bold mb-1">{sweet.name}</h3>
        {sweet.category && (
          <p className="text-xs text-[var(--primary)] mb-2 uppercase tracking-wide">
            {sweet.category}
          </p>
        )}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sweet.desc}</p>

        {/* Footer (price + button) */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[var(--accent)] font-extrabold text-2xl">
            ${sweet.price}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePurchase}
            disabled={loading || quantity <= 0}
            className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] 
                       text-white font-bold rounded-full shadow-lg text-sm
                       hover:from-[var(--primary)] hover:to-[var(--accent)] transition 
                       disabled:opacity-50"
          >
            {loading ? "..." : "Purchase"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}


function MenuGrid() {
		const { isAdmin, token } = useAuth();
		const [sweets, setSweets] = useState<Sweet[]>([]);
		const [loading, setLoading] = useState(true);
		const [error, setError] = useState("");
		const [search, setSearch] = useState("");
		const [category, setCategory] = useState("");
		const [allCategories, setAllCategories] = useState<string[]>([]);
		// Add Sweet form state
		const [addForm, setAddForm] = useState({ name: "", category: "", price: "", quantity: "" });
		const [addLoading, setAddLoading] = useState(false);
		const [editId, setEditId] = useState<string | null>(null);
		const [editForm, setEditForm] = useState({ name: "", category: "", price: "", quantity: "" });
		const [editLoading, setEditLoading] = useState(false);
	// Add Sweet handler
		async function handleAddSweet(e: React.FormEvent) {
			e.preventDefault();
			setAddLoading(true);
			try {
				const { addSweet } = await import("./services/api");
				const sweet = {
					name: addForm.name,
					category: addForm.category,
					price: Number(addForm.price),
					quantity: Number(addForm.quantity),
				};
				await addSweet(sweet, token);
				toast.success("Sweet added!");
				setAddForm({ name: "", category: "", price: "", quantity: "" });
				// Refresh list
				const data = await fetchSweets();
				setSweets(data);
				setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
			} catch (e) {
				toast.error("Failed to add sweet.");
			} finally {
				setAddLoading(false);
			}
		}

	// Edit Sweet handler
		async function handleEditSweet(e: React.FormEvent) {
			e.preventDefault();
			if (!editId) return;
			setEditLoading(true);
			try {
				const { updateSweet } = await import("./services/api");
				const sweet = {
					name: editForm.name,
					category: editForm.category,
					price: Number(editForm.price),
					quantity: Number(editForm.quantity),
				};
				await updateSweet(editId, sweet, token);
				toast.success("Sweet updated!");
				setEditId(null);
				setEditForm({ name: "", category: "", price: "", quantity: "" });
				// Refresh list
				const data = await fetchSweets();
				setSweets(data);
				setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
			} catch (e) {
				toast.error("Failed to update sweet.");
			} finally {
				setEditLoading(false);
			}
		}

	// Delete Sweet handler
		async function handleDeleteSweet(id: string) {
			if (!window.confirm("Delete this sweet?")) return;
			try {
				const { deleteSweet } = await import("./services/api");
				await deleteSweet(id, token);
				toast.success("Sweet deleted!");
				// Refresh list
				const data = await fetchSweets();
				setSweets(data);
				setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
			} catch (e) {
				toast.error("Failed to delete sweet.");
			}
		}

		useEffect(() => {
			fetchSweets()
				.then((data) => {
					setSweets(data);
					// Extract unique categories for filter dropdown
					setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
				})
				.catch(() => setError("Failed to load sweets."))
				.finally(() => setLoading(false));
		}, []);

  if (loading) return <div className="text-center text-[var(--primary)] mt-16 text-xl">Loading delicious sweets...</div>;
  if (error) return <div className="text-center text-[var(--destructive)] mt-16 text-xl">{error}</div>;

  // Filter sweets by search and category
  const filteredSweets = sweets.filter((sweet) => {
    const matchesName = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? sweet.category === category : true;
    return matchesName && matchesCategory;
  });

  // Map sweet names to public images
  const sweetImages: Record<string, string> = {
    'Gulab Jamun': '/GulabJamun.jpg',
    'Rasmalai': '/Rasmalai.jpg',
    'ChamCham': '/ChamCham.jpeg',
    // Add more mappings as needed
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4">
      <h2 className="text-4xl font-extrabold text-center text-white mb-12">Our Sweet Selection</h2>
      {/* Admin Add Sweet Form */}
      {isAdmin && (
        <form onSubmit={handleAddSweet} className="flex flex-wrap gap-4 mb-8 items-end bg-[oklch(from_var(--background)_l_c_h_/_60%)] p-4 rounded-xl border border-[var(--sidebar-border)]">
          <input required value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white w-40" />
          <input required value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white w-32" />
          <input required value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" type="number" min="0" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white w-24" />
          <input required value={addForm.quantity} onChange={e => setAddForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Qty" type="number" min="0" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white w-20" />
          <button type="submit" disabled={addLoading} className="px-4 py-2 bg-[var(--primary)] text-white rounded font-bold hover:bg-[var(--primary)] disabled:opacity-60">{addLoading ? "Adding..." : "Add Sweet"}</button>
        </form>
      )}
      {/* Search and filter section */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-center">
        <input
          type="text"
          placeholder="Search sweets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--primary)] bg-black text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--primary)] bg-black text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-56"
        >
          <option value="">All Types</option>
          {allCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredSweets.map((sweet: Sweet) => {
          const img = sweetImages[sweet.name] || sweet.img;
          // Admin edit mode
          if (isAdmin && editId === sweet._id) {
            return (
              <form key={sweet._id} onSubmit={handleEditSweet} className="bg-[oklch(from_var(--background)_l_c_h_/_70%)] border border-[var(--sidebar-border)] rounded-2xl p-4 flex flex-col gap-2 shadow-xl">
                <input required value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white" />
                <input required value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white" />
                <input required value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" type="number" min="0" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white" />
                <input required value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Qty" type="number" min="0" className="px-3 py-2 rounded border border-[var(--primary)] bg-black text-white" />
                <div className="flex gap-2 mt-2">
                  <button type="submit" disabled={editLoading} className="px-4 py-2 bg-[var(--primary)] text-white rounded font-bold hover:bg-[var(--primary)] disabled:opacity-60">{editLoading ? "Saving..." : "Save"}</button>
                  <button type="button" onClick={() => setEditId(null)} className="px-4 py-2 bg-gray-700 text-white rounded font-bold hover:bg-gray-800">Cancel</button>
                </div>
              </form>
            );
          }
          return (
            <div key={sweet._id || sweet.name} className="relative">
              <SweetCard sweet={{ ...sweet, img }} />
              {isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button onClick={() => {
                    setEditId(sweet._id!);
                    setEditForm({
                      name: sweet.name,
                      category: sweet.category || "",
                      price: String(sweet.price),
                      quantity: String(sweet.quantity ?? 0),
                    });
                  }} className="px-2 py-1 bg-[var(--secondary)] text-black rounded font-bold text-xs hover:bg-[var(--secondary)]">Edit</button>
                  <button onClick={() => handleDeleteSweet(sweet._id!)} className="px-2 py-1 bg-[var(--destructive)] text-white rounded font-bold text-xs hover:bg-[var(--destructive)]">Delete</button>
                </div>
              )}
            </div>
          );
        })}
        {filteredSweets.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-lg py-12">No sweets found.</div>
        )}
      </div>
    </div>
  );

}


// (Other helper components are not strictly needed in the main file but are kept here)
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] bg-[oklch(from_var(--background)_l_c_h_/_50%)] rounded-lg m-8">
      <h2 className="text-4xl font-bold text-[var(--primary)] mb-4">{title}</h2>
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
                      <circle cx="450" cy="450" r="420" fill="oklch(from var(--primary) l c h / 15%)" /> {/* Darker Circle */}
                      <text x="50%" y="38%" textAnchor="middle" fontSize="180" fill="oklch(from var(--primary) l c h / 30%)" opacity="0.3" fontFamily="Poppins, Inter, Quicksand">🍩</text>
                      <text x="30%" y="65%" textAnchor="middle" fontSize="120" fill="oklch(from var(--accent) l c h / 30%)" opacity="0.3">🍬</text>
                      <text x="70%" y="70%" textAnchor="middle" fontSize="140" fill="oklch(from var(--primary) l c h / 30%)" opacity="0.3">🧁</text>
                      <text x="60%" y="50%" textAnchor="middle" fontSize="100" fill="oklch(from var(--accent) l c h / 30%)" opacity="0.3">🍭</text>
                    </svg>
                    {/* Floating candy SVGs - Keep the visual effects but ensure they match the dark theme */}
                    <svg className="floating-candy candy1" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--primary)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍬</text></svg>
                    <svg className="floating-candy candy2" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--accent)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍭</text></svg>
                    <svg className="floating-candy candy3" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--primary)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🧁</text></svg>
                    <svg className="floating-candy candy4" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--accent)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍩</text></svg>            
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
    <footer className="bg-[oklch(from_var(--background)_l_c_h_/_80%)] border-t border-[var(--sidebar-border)] py-6 mt-16">
      <div className="max-w-[85rem] mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} SoSweet. All rights reserved. | <span className="text-[var(--primary)]">UI inspired by ReadymadeUI</span>
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