import { Link } from "react-router-dom";
import styles from "./Lnavbar.module.css"
const Lnavbar = () => {
  return (
    <div>
      <nav className={styles.navbar}>
              <h1 className={styles.logo}><Link to="/" className={styles.main}>Gigflow</Link></h1>
              <ul className={styles.navLinks}>
                <li>How it Works</li>
                <li>Find Gigs</li>
                <li>Freelancers</li>
                <li>Login</li>
              </ul>
              <div className={styles.buttons}>
              <Link to="/signup" className={styles.Btn}>Sign Up</Link>
              <Link to="/login" className={styles.Btn}>Log In</Link>
              </div>
            </nav>
    </div>
  )
}

export default Lnavbar
