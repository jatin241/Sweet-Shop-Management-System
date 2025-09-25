import React, { useEffect, useState } from "react";
import { fetchSweets, searchSweets, purchaseSweet } from "./services/api";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

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
        <button
          type="submit"
          className="bg-pink-400 text-white font-bold px-6 py-2 rounded hover:bg-pink-500 transition-colors"
          disabled={loading}
        >
          Search
        </button>
        <button
          type="button"
          className="bg-pink-200 text-[#4d2323] font-bold px-4 py-2 rounded hover:bg-pink-300 transition-colors"
          onClick={async () => { setLoading(true); setError(""); setSearch(""); setCategory(""); try { const all = await fetchSweets(); setSweets(all); } catch { setError("Failed to load sweets."); } finally { setLoading(false); } }}
        >
          Reset
        </button>
      </form>
      {loading && <div className="text-pink-100 text-center">Loading sweets...</div>}
      {error && <div className="text-red-400 text-center">{error}</div>}
      {!loading && !error && (
        <table className="w-full text-pink-100 border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-[#4d2323]">
              <th className="py-2">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sweets.map((sweet, idx) => {
              // Try to match sweet name to image file in public folder
              const nameToFile: Record<string, string> = {
                "Gulab Jamun": "/Gulab Jamun.jpg",
                "Rasmalai": "/Rasmalai.jpg",
                "ChamCham": "/ChamCham.jpeg",
              };
              // fallback: try to find by lowercased, no spaces
              let imgSrc = nameToFile[sweet.name] || "/vite.svg";
              // Optionally, try to match more flexibly
              if (!nameToFile[sweet.name]) {
                if (sweet.name) {
                  const files = ["/Gulab Jamun.jpg", "/Rasmalai.jpg", "/ChamCham.jpeg"];
                  const match = files.find(f => f.toLowerCase().replace(/[^a-z]/g,"") === ("/"+sweet.name.toLowerCase().replace(/[^a-z]/g,"") + (f.endsWith(".jpeg") ? ".jpeg" : ".jpg")));
                  if (match) imgSrc = match;
                }
              }
              async function handlePurchase() {
                try {
                  await purchaseSweet(sweet._id || sweet.name, 1);
                  setSweets(prev => prev.map((s, i) => i === idx ? { ...s, quantity: (s.quantity || 1) - 1 } : s));
                  toast.success("Purchase successful!");
                } catch {
                  toast.error("Purchase failed.");
                }
              }
              return (
                <tr key={sweet._id || sweet.name} className="bg-[#6e3d3d] rounded-lg">
                  <td className="py-2"><img src={imgSrc} alt={sweet.name} className="w-16 h-10 object-cover rounded" /></td>
                  <td>{sweet.name}</td>
                  <td>{sweet.category || '-'}</td>
                  <td>${sweet.price}</td>
                  <td>{sweet.quantity ?? '-'}</td>
                  <td>
                    <button
                      className="bg-pink-400 text-white font-bold px-4 py-1 rounded hover:bg-pink-500 transition-colors disabled:opacity-60"
                      disabled={!sweet.quantity || sweet.quantity <= 0}
                      onClick={handlePurchase}
                    >
                      Purchase
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
