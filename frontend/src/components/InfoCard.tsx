
import { motion } from "framer-motion";

function InfoCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <motion.div
      className="flex flex-col items-center bg-[var(--muted)] rounded-xl px-6 py-6 shadow-2xl border border-[var(--sidebar-border)] w-64 hover:border-[var(--primary)] transition-all duration-300"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px 0 oklch(from var(--primary) l c h / 0.3)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <span className="text-4xl mb-3">{icon}</span>
      <span className="font-bold text-black text-xl mb-2">{title}</span>
      <span className=" text-center text-sm">{desc}</span>
    </motion.div>
  );
}

export default InfoCard;
