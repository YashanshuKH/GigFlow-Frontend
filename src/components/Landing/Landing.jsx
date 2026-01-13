import Lnavbar from "../LNavbar/Lnavbar";
import styles from "./Landing.module.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className={styles.container}>
      <Lnavbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>
            Where Clients Post. <br />
            Freelancers Bid. <br />
            Work Gets Done.
          </h2>
          <p>
            Gigflow connects skilled freelancers with real client requirements.
            Bid smartly, win projects, and grow your freelance career.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>
              {" "}
              <Link to="/login" className={styles.heroButtons1}>
                Post a Requirement
              </Link>
              
            </button>
            <button className={styles.secondaryBtn}><Link to="/login" className={styles.heroButtons1}>Start Bidding</Link>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.steps}>
        <h3>How Gigflow Works</h3>
        <div className={styles.stepGrid}>
          <div className={styles.stepCard}>
            <h4>1. Client Posts Requirement</h4>
            <p>Clients share project details, budget & timeline.</p>
          </div>
          <div className={styles.stepCard}>
            <h4>2. Freelancers Bid</h4>
            <p>Freelancers send proposals with price & delivery time.</p>
          </div>
          <div className={styles.stepCard}>
            <h4>3. Work & Get Paid</h4>
            <p>Client selects best bid. Project starts instantly.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h3>Ready to Win Your Next Gig?</h3>
        <p>Join thousands of freelancers already using Gigflow.</p>
        <button className={styles.primaryBtn}>Create Free Account</button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© 2026 Gigflow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
