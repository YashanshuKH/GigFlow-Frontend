import { useNavigate } from "react-router-dom";
import styles from "../FreelancerNavbar/FreelancerNavbar.module.css";

const FreelancerNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <h2>Gigflow</h2>
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default FreelancerNavbar;
