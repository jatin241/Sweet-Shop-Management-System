import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HomeHero: React.FC = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden">
      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-morphism bg-black/80 border-white/20 rounded-3xl shadow-2xl p-10 max-w-xl w-full text-center z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 drop-shadow-neon mb-4">
          Welcome to the Sweet Shop
        </h1>
        <p className="text-lg text-white/80 mb-6">
          Discover, purchase, and manage your favorite sweets with a modern, immersive experience.
        </p>
        <Link to="/dashboard">
          <button className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-xl shadow-neon transition-all text-lg">
            Explore Sweets
          </button>
        </Link>
      </motion.div>
      {/* Floating Candy Emojis */}
      <span className="absolute left-8 top-8 text-7xl opacity-10 select-none">🍬</span>
      <span className="absolute right-12 top-24 text-8xl opacity-10 select-none">🍭</span>
      <span className="absolute left-16 bottom-16 text-8xl opacity-10 select-none">🧁</span>
      <span className="absolute right-10 bottom-10 text-7xl opacity-10 select-none">🍫</span>
    </section>
  );
};

export default HomeHero;
