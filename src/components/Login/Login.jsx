import { useState } from "react";
import styles from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Lnavbar from "../LNavbar/Lnavbar";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("role", user.role);

      alert("Login successful");

      if (user.role === "client") {
        navigate("/client-dashboard");
      } else {
        navigate("/freelancer-dashboard");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div>
      <Lnavbar />

      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Welcome Back</h2>
          <p>Login to continue on Gigflow</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button type="submit" className={styles.primaryBtn}>
              Login
            </button>
          </form>

          <p className={styles.switchText}>
            New here?
            <Link to="/signup" className={styles.link}>
              Create New Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
