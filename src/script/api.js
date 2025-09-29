import axios from "axios";

// Crea la instancia de Axios con baseURL tomdada desde las variables de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
