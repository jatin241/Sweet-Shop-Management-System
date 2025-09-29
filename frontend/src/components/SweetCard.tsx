import React, { useState } from "react";
import { motion } from "framer-motion";
import { purchaseSweet } from "../services/api";
import { toast } from "sonner";

type Sweet = {
  _id?: string;
  name: string;
  desc?: string;
  category?: string;
  price: number;
  quantity?: number;
  img: string;
};

const SweetCard: React.FC<{ sweet: Sweet }> = ({ sweet }) => {
  const [quantity, setQuantity] = useState(sweet.quantity ?? 0);
  const [loading, setLoading] = useState(false);
  const defaultImg = '/public/pexels-mccutcheon-1191639.jpg';

  async function handlePurchase() {
    if (quantity <= 0) return toast.error("Out of stock!");
    setLoading(true);
    try {
      await purchaseSweet(sweet._id!, 1);
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
      className="group relative bg-gradient-to-br from-[var(--muted)] via-[var(--background)] to-[var(--muted)] \
                 rounded-3xl shadow-2xl p-5 border border-[var(--sidebar-border)] \
                 overflow-hidden backdrop-blur-md"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[oklch(from var(--primary) l c h / 20%)] to-[oklch(from var(--accent) l c h / 20%)] opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
      <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
        <img
          src={sweet.img && sweet.img.trim() !== '' ? sweet.img : defaultImg}
          alt={sweet.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
        />
        {typeof quantity === "number" && (
          <span className="absolute top-3 left-3 bg-[oklch(from var(--accent) l c h / 90%)] text-gray-900 text-xs px-3 py-1 rounded-full font-extrabold shadow-md">
            {quantity} left
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-black text-lg font-bold mb-1">{sweet.name}</h3>
        {sweet.category && (
          <p className="text-xs text-[var(--primary)] mb-2 uppercase tracking-wide">
            {sweet.category}
          </p>
        )}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sweet.desc}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[var(--accent)] font-extrabold text-2xl">
            ${sweet.price}
          </span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePurchase}
            disabled={loading || quantity <= 0}
            className="px-5 py-2.5 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] \
                       text-white font-bold rounded-full shadow-lg text-sm\
                       hover:from-[var(--primary)] hover:to-[var(--accent)] transition \
                       disabled:opacity-50"
          >
            {loading ? "..." : "Purchase"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SweetCard;
