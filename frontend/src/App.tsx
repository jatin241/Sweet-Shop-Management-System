

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "sonner";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import SimpleNavbar from "./components/SimpleNavbar";
import HomeHero from "./components/HomeHero";
import MenuGrid from "./components/MenuGrid";
import AppFooter from "./components/AppFooter";
import ProtectedRoute from "./components/ProtectedRoute";
import Placeholder from "./components/Placeholder";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen relative bg-black ">
            <svg className="sweet-watermark-bg" viewBox="0 0 900 900" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="450" cy="450" r="420" fill="oklch(from var(--primary) l c h / 15%)" />
              <text x="50%" y="38%" textAnchor="middle" fontSize="180" fill="oklch(from var(--primary) l c h / 30%)" opacity="0.3" fontFamily="Poppins, Inter, Quicksand">🍩</text>
              <text x="30%" y="65%" textAnchor="middle" fontSize="120" fill="oklch(from var(--accent) l c h / 30%)" opacity="0.3">🍬</text>
              <text x="70%" y="70%" textAnchor="middle" fontSize="140" fill="oklch(from var(--primary) l c h / 30%)" opacity="0.3">🧁</text>
              <text x="60%" y="50%" textAnchor="middle" fontSize="100" fill="oklch(from var(--accent) l c h / 30%)" opacity="0.3">🍭</text>
            </svg>
            <svg className="floating-candy candy1" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--primary)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍬</text></svg>
            <svg className="floating-candy candy2" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--accent)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍭</text></svg>
            <svg className="floating-candy candy3" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--primary)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🧁</text></svg>
            <svg className="floating-candy candy4" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="var(--accent)" /><text x="50%" y="55%" textAnchor="middle" fontSize="32" fill="#fff">🍩</text></svg>
            <Toaster position="top-center" richColors />
            <SimpleNavbar />
            <main>
              <Routes>
                <Route path="/" element={<HomeHero />} />
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


export default App;