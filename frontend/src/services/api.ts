import axios from "axios";

const API_URL = "https://sweet-shop-management-system-production.up.railway.app";

export async function fetchSweets() {
  const res = await axios.get(`${API_URL}/api/sweets`);
  return res.data.sweets;
}

export async function purchaseSweet(id: string, quantity: number) {
  const res = await axios.post(`${API_URL}/api/sweets/${id}/purchase`, { quantity });
  return res.data;
}

export async function searchSweets(params: { name?: string; category?: string; minPrice?: number; maxPrice?: number }) {
  const res = await axios.post(`${API_URL}/api/sweets/search`, params);
  return res.data.sweets;
}

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
}

export async function register(email: string, password: string, isAdmin: boolean) {
  const res = await axios.post(`${API_URL}/api/auth/register`, { email, password, isAdmin });
  return res.data;
}

// Admin: Add a new sweet
export async function addSweet(sweet: { name: string; category: string; price: number; quantity: number }, token: string) {
  const res = await axios.post(
    `${API_URL}/api/sweets`,
    sweet,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// Admin: Update a sweet
export async function updateSweet(id: string, sweet: { name: string; category: string; price: number; quantity: number }, token: string) {
  const res = await axios.put(
    `${API_URL}/api/sweets/${id}`,
    sweet,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// Admin: Delete a sweet
export async function deleteSweet(id: string, token: string) {
  const res = await axios.delete(
    `${API_URL}/api/sweets/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}
