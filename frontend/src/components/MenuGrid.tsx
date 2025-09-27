
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { fetchSweets } from "../services/api";
import { toast } from "sonner";
import SweetCard from "./SweetCard";

type Sweet = {
  _id?: string;
  name: string;
  desc?: string;
  category?: string;
  price: number;
  quantity?: number;
  img: string;
};

const MenuGrid: React.FC = () => {
  const { isAdmin, token } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [addForm, setAddForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [editLoading, setEditLoading] = useState(false);

  async function handleAddSweet(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    try {
      const { addSweet } = await import("../services/api");
      const sweet = {
        name: addForm.name,
        category: addForm.category,
        price: Number(addForm.price),
        quantity: Number(addForm.quantity),
      };
      await addSweet(sweet, token!);
      toast.success("Sweet added!");
      setAddForm({ name: "", category: "", price: "", quantity: "" });
      const data = await fetchSweets();
      setSweets(data);
      setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
    } catch (e) {
      toast.error("Failed to add sweet.");
    } finally {
      setAddLoading(false);
    }
  }

  async function handleEditSweet(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    setEditLoading(true);
    try {
      const { updateSweet } = await import("../services/api");
      const sweet = {
        name: editForm.name,
        category: editForm.category,
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
      };
      await updateSweet(editId, sweet, token!);
      toast.success("Sweet updated!");
      setEditId(null);
      setEditForm({ name: "", category: "", price: "", quantity: "" });
      const data = await fetchSweets();
      setSweets(data);
      setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
    } catch (e) {
      toast.error("Failed to update sweet.");
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDeleteSweet(id: string) {
    if (!window.confirm("Delete this sweet?")) return;
    try {
      const { deleteSweet } = await import("../services/api");
      await deleteSweet(id, token!);
      toast.success("Sweet deleted!");
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
        setAllCategories(Array.from(new Set(data.map((s: Sweet) => s.category).filter(Boolean))));
      })
      .catch(() => setError("Failed to load sweets."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-[var(--primary)] mt-16 text-xl">Loading delicious sweets...</div>;
  if (error) return <div className="text-center text-[var(--destructive)] mt-16 text-xl">{error}</div>;

  const filteredSweets = sweets.filter((sweet) => {
    const matchesName = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? sweet.category === category : true;
    return matchesName && matchesCategory;
  });

  const sweetImages: Record<string, string> = {
      'Gulab Jamun':'/GulabJamun',
    'Rasmalai': '/Rasmalai.jpg',
    'ChamCham': '/ChamCham.jpeg',
    'Peda': '/pexels-mccutcheon-1191639.jpg',
    // Add more mappings as you add images to public/
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[var(--muted)] px-0 py-0">
      <div className="max-w-7xl mx-auto py-20 px-6">
        <h2 className="text-5xl font-extrabold text-center text-[var(--primary)] mb-14 tracking-tight drop-shadow-lg">Our Sweet Selection</h2>
        <p className="text-center text-lg text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto">Browse our handpicked sweets, crafted with love and tradition. Use the search and filter to find your favorite treat!</p>
        {isAdmin && (
          <motion.form 
            onSubmit={handleAddSweet} 
            className="flex flex-wrap gap-4 text-black mb-12 items-end bg-white/90 p-6 rounded-2xl shadow-xl border border-[var(--sidebar-border)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input required value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-4 py-3 text-black rounded-xl bg-white border border-gray-300  w-44 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm" />
            <input required value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="px-4 py-3 rounded-xl bg-white border border-gray-300  w-36 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm" />
            <input required value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" type="number" min="0" className="px-4 py-3 rounded-xl bg-white border border-gray-300  w-28 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm" />
            <input required value={addForm.quantity} onChange={e => setAddForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Qty" type="number" min="0" className="px-4 py-3 rounded-xl bg-white border border-gray-300 w-24 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] shadow-sm" />
            <button type="submit" disabled={addLoading} className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-bold rounded-xl shadow-lg text-base hover:from-[var(--primary)] hover:to-[var(--accent)] transition disabled:opacity-50">
              {addLoading ? "Adding..." : "Add Sweet"}
            </button>
          </motion.form>
        )}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-center">
          <input
            type="text"
            placeholder="Search sweets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-5 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-72 shadow-md"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-5 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64 shadow-md"
          >
            <option value="">All Types</option>
            {allCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredSweets.map((sweet: Sweet) => {
            // Always override img with mapped public image if available
            const mappedImg = sweetImages[sweet.name];
            const sweetWithImg = mappedImg ? { ...sweet, img: mappedImg } : sweet;
            if (isAdmin && editId === sweet._id) {
              return (
                <motion.form 
                  key={sweet._id} 
                  onSubmit={handleEditSweet} 
                  className="bg-gradient-to-br from-[var(--muted)] via-[var(--background)] to-[var(--muted)] border border-[var(--sidebar-border)] rounded-2xl p-6 flex flex-col gap-3 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <input required value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" className="px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  <input required value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  <input required value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} placeholder="Price" type="number" min="0" className="px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  <input required value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} placeholder="Qty" type="number" min="0" className="px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                  <div className="flex gap-3 mt-2">
                    <button type="submit" disabled={editLoading} className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-bold rounded-xl shadow-lg text-base hover:from-[var(--primary)] hover:to-[var(--accent)] transition disabled:opacity-50">
                      {editLoading ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditId(null)} className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl shadow-lg text-base hover:bg-gray-800 transition">Cancel</button>
                  </div>
                </motion.form>
              );
            }
            return (
              <div key={sweet._id || sweet.name} className="relative">
                <SweetCard sweet={sweetWithImg} />
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-3 z-10">
                    <button onClick={() => {
                      setEditId(sweet._id!);
                      setEditForm({
                        name: sweet.name,
                        category: sweet.category || "",
                        price: String(sweet.price),
                        quantity: String(sweet.quantity ?? 0),
                      });
                    }} className="px-3 py-2 bg-[var(--secondary)] text-black rounded-xl font-bold text-xs hover:bg-[var(--secondary)] shadow-md">Edit</button>
                    <button onClick={() => handleDeleteSweet(sweet._id!)} className="px-3 py-2 bg-[var(--destructive)] text-white rounded-xl font-bold text-xs hover:bg-[var(--destructive)] shadow-md">Delete</button>
                  </div>
                )}
              </div>
            );
          })}
          {filteredSweets.length === 0 && (
            <div className="col-span-full text-center text-gray-400 text-lg py-16">No sweets found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;
