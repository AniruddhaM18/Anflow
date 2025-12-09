import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export { BACKEND_URL };

// Make axios include cookies on ALL requests
axios.defaults.withCredentials = true;