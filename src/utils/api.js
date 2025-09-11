import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE.API_BASE_URL,
})
