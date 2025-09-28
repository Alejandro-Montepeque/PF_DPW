import axios from "axios";

// Crear instancia de Axios con baseURL desde variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
