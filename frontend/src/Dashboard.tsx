
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSweets, searchSweets, purchaseSweet, addSweet, updateSweet, deleteSweet } from "./services/api";
import { toast } from "sonner";
import { useAuth } from "./contexts/AuthContext";


const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  // Admin CRUD state
  const [addForm, setAddForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", category: "", price: "", quantity: "" });
  const { token, isAdmin } = useAuth();


  useEffect(() => {
    fetchSweets()
      .then(setSweets)
      .catch(() => setError("Failed to load sweets."))
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const filtered = await searchSweets({ name: search, category });
      setSweets(filtered);
    } catch {
      setError("Failed to search sweets.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-[#5e2d2d] rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-bold text-pink-200 mb-6 text-center">Sweets Dashboard</h2>

      {/* Admin Add Sweet Form */}
      {isAdmin && (
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (!addForm.name || !addForm.price || !addForm.quantity) {
              toast.error("Name, price, and quantity required");
              return;
            }
            try {
              await addSweet({
                name: addForm.name,
                category: addForm.category,
                price: Number(addForm.price),
                quantity: Number(addForm.quantity),
              }, token!);
              toast.success("Sweet added!");
              setAddForm({ name: "", category: "", price: "", quantity: "" });
              setSweets(await fetchSweets());
            } catch (err: any) {
              toast.error(err?.response?.data?.msg || "Failed to add sweet");
            }
          }}
          className="flex flex-wrap gap-4 justify-center mb-8 bg-[#4d2323] p-4 rounded-lg"
        >
          <input type="text" placeholder="Name" value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} className="px-3 py-2 rounded bg-[#5e2d2d] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400" required />
          <input type="text" placeholder="Category" value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))} className="px-3 py-2 rounded bg-[#5e2d2d] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400" />
          <input type="number" placeholder="Price" value={addForm.price} onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))} className="px-3 py-2 rounded bg-[#5e2d2d] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400" required min="0" />
          <input type="number" placeholder="Quantity" value={addForm.quantity} onChange={e => setAddForm(f => ({ ...f, quantity: e.target.value }))} className="px-3 py-2 rounded bg-[#5e2d2d] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400" required min="0" />
          <motion.button
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.07 }}
            type="submit"
            className="bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow hover:shadow-lg transition-all"
          >
            Add Sweet
          </motion.button>
        </form>
      )}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded bg-[#4d2323] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400"
        />
        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-2 rounded bg-[#4d2323] text-pink-100 border border-pink-300 focus:outline-none focus:border-pink-400"
        />
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.07 }}
          type="submit"
          className="bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow hover:shadow-lg transition-all"
          disabled={loading}
        >
          Search
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.07 }}
          type="button"
          className="bg-pink-100 text-[#4d2323] font-bold px-4 py-2 rounded-full shadow hover:bg-pink-200 transition-all"
          onClick={async () => { setLoading(true); setError(""); setSearch(""); setCategory(""); try { const all = await fetchSweets(); setSweets(all); } catch { setError("Failed to load sweets."); } finally { setLoading(false); } }}
        >
          Reset
        </motion.button>
      </form>
      {loading && <div className="text-pink-100 text-center">Loading sweets...</div>}
      {error && <div className="text-red-400 text-center">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-8">
          {sweets.map((sweet, idx) => {
            const nameToFile: Record<string, string> = {
              "Gulab Jamun": "/Gulab Jamun.jpg",
              "Rasmalai": "/Rasmalai.jpg",
              "ChamCham": "/ChamCham.jpeg",
            };
            let imgSrc = nameToFile[sweet.name] || "/vite.svg";
            if (!nameToFile[sweet.name]) {
              if (sweet.name) {
                const files = ["/Gulab Jamun.jpg", "/Rasmalai.jpg", "/ChamCham.jpeg"];
                const match = files.find(f => f.toLowerCase().replace(/[^a-z]/g,"") === ("/"+sweet.name.toLowerCase().replace(/[^a-z]/g,"") + (f.endsWith(".jpeg") ? ".jpeg" : ".jpg")));
                if (match) imgSrc = match;
              }
            }
            // Candy/dessert icon for card overlay
            const candyIcons = ["🍩","🧁","🍬","🍭","🍪","🍫","🍰"];
            const candyIcon = candyIcons[idx % candyIcons.length];
            async function handlePurchase() {
              try {
                await purchaseSweet(sweet._id || sweet.name, 1);
                setSweets(prev => prev.map((s, i) => i === idx ? { ...s, quantity: (s.quantity || 1) - 1 } : s));
                toast.success("Purchase successful!");
              } catch {
                toast.error("Purchase failed.");
              }
            }
            // Admin: handle edit
            function startEdit() {
              setEditIdx(idx);
              setEditForm({
                name: sweet.name,
                category: sweet.category || "",
                price: sweet.price?.toString() || "",
                quantity: sweet.quantity?.toString() || "",
              });
            }
            async function handleEditSave() {
              try {
                await updateSweet(sweet._id, {
                  name: editForm.name,
                  category: editForm.category,
                  price: Number(editForm.price),
                  quantity: Number(editForm.quantity),
                }, token!);
                toast.success("Sweet updated!");
                setEditIdx(null);
                setSweets(await fetchSweets());
              } catch (err: any) {
                toast.error(err?.response?.data?.msg || "Failed to update sweet");
              }
            }
            async function handleDelete() {
              if (!window.confirm("Delete this sweet?")) return;
              try {
                await deleteSweet(sweet._id, token!);
                toast.success("Sweet deleted!");
                setSweets(await fetchSweets());
              } catch (err: any) {
                toast.error(err?.response?.data?.msg || "Failed to delete sweet");
              }
            }
            return (
              <div
                key={sweet._id || sweet.name}
                className="relative bg-gradient-to-tr from-pink-100 via-pink-200 to-pink-300 rounded-3xl shadow-xl p-5 flex flex-col items-center group transition-transform duration-200 hover:scale-105 hover:shadow-2xl border-2 border-pink-200"
              >
                {/* Candy icon overlay */}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl drop-shadow-lg select-none">
                  {candyIcon}
                </span>
                <img src={imgSrc} alt={sweet.name} className="w-24 h-16 object-cover rounded-xl mb-2 border-2 border-pink-300 group-hover:border-pink-400 transition-colors duration-200 bg-white" />
                {editIdx === idx ? (
                  <>
                    <input type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="px-2 py-1 rounded bg-white text-pink-700 border border-pink-300 w-24 mb-1" />
                    <input type="text" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} className="px-2 py-1 rounded bg-white text-pink-700 border border-pink-300 w-20 mb-1" />
                    <input type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} className="px-2 py-1 rounded bg-white text-pink-700 border border-pink-300 w-16 mb-1" />
                    <input type="number" value={editForm.quantity} onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} className="px-2 py-1 rounded bg-white text-pink-700 border border-pink-300 w-16 mb-2" />
                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.07 }} className="bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white font-bold px-3 py-1 rounded-full shadow hover:shadow-lg transition-all" onClick={handleEditSave}>Save</motion.button>
                      <motion.button whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.07 }} className="bg-pink-100 text-[#4d2323] font-bold px-3 py-1 rounded-full shadow hover:bg-pink-200 transition-all" onClick={() => setEditIdx(null)}>Cancel</motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-bold text-pink-700 mb-1 text-center">{sweet.name}</div>
                    <div className="text-xs text-pink-500 mb-1">{sweet.category || '-'}</div>
                    <div className="text-pink-600 font-bold text-xl mb-1">${sweet.price}</div>
                    <div className="text-xs text-pink-400 mb-2">{sweet.quantity ?? '-'} left</div>
                    <div className="flex gap-2 w-full justify-center">
                      <motion.button
                        whileTap={{ scale: 0.93 }}
                        whileHover={{ scale: 1.12 }}
                        className="bg-gradient-to-tr from-pink-300 via-pink-400 to-pink-500 text-white font-bold px-4 py-1 rounded-full shadow hover:shadow-lg transition-all disabled:opacity-60"
                        disabled={!sweet.quantity || sweet.quantity <= 0}
                        onClick={handlePurchase}
                      >
                        Purchase
                      </motion.button>
                      {isAdmin && (
                        <>
                          <motion.button whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.07 }} className="bg-yellow-300 text-[#4d2323] font-bold px-2 py-1 rounded-full shadow hover:bg-yellow-400 transition-all" onClick={startEdit}>Edit</motion.button>
                          <motion.button whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.07 }} className="bg-red-300 text-white font-bold px-2 py-1 rounded-full shadow hover:bg-red-400 transition-all" onClick={handleDelete}>Delete</motion.button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
