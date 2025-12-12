import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export { BACKEND_URL };

// Make axios include cookies on ALL requests
axios.defaults.withCredentials = true;