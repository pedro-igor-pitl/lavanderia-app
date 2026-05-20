import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.0.246:8080", // Android emulator
});

export default api;