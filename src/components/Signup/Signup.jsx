import { useState } from "react";
import Lnavbar from "../LNavbar/Lnavbar";
import styles from "./Signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;

      await axios.post(
        "http://localhost:3000/api/auth/signup",
        dataToSend
      );

      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div>
      <Lnavbar />

      <div className={styles.container}>
        <div className={styles.card}>
          <h2>Create Account</h2>
          <p>Join Gigflow Now</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              onChange={handleChange}
              required
            />

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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
            />

            {/* ROLE SELECT */}
            <select
              name="role"
              className={styles.select}
              onChange={handleChange}
            >
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>

            <button type="submit" className={styles.primaryBtn}>
              Sign Up
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
