import axios from "axios";

const API = axios.create({
  baseURL: "https://gigflow-backend-8ili.onrender.com/api/auth",
});

// SIGNUP
export const signupUser = (formData) =>
  API.post("/signup", formData);

// LOGIN
export const loginUser = (formData) =>
  API.post("/login", formData);
