import React from "react";
import { motion } from "framer-motion";
import InfoCard from "./InfoCard";

function HomeHero() {
  return (
    <div className="w-full flex flex-col items-center pt-24 pb-32 relative bg-black" style={{ minHeight: 600 }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--muted)] to-[var(--background)] opacity-90 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,...')] opacity-10 z-0"></div>
      <motion.div
        className="flex flex-col items-center w-full z-10 max-w-4xl px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-center text-white leading-tight mb-6">
          <span className="block">Indulge Your</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">Sweet Cravings</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 text-center max-w-2xl">
          Discover artisanal sweets: crafted with passion, delivered with care. The best things in life are warm, custard, and topped with delicious cream.
        </p>
      </motion.div>
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

export default HomeHero;
