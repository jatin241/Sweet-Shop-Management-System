import axios from "axios";

const API_URL = "http://localhost:3000";

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
