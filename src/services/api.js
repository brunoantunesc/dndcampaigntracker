// src/services/api.js

import { authFetch } from '../utils/authFetch';
const API_BASE_URL = 'http://localhost:4000';

export async function fetchRoutes() {
  try {
    const res = await authFetch(`${API_BASE_URL}/routes`);
    if (!res.ok) {
      throw new Error('Failed to fetch routes');
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
