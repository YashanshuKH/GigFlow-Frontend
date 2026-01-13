import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/auth",
});

// SIGNUP
export const signupUser = (formData) =>
  API.post("/signup", formData);

// LOGIN
export const loginUser = (formData) =>
  API.post("/login", formData);
