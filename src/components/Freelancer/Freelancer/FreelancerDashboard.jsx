import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import FreelancerNavbar from "../FreelancerNavbar/FreelancerNavbar";
import styles from "./FreelancerDashboard.module.css";

// ⚠️ Backend port (NOT 5173)
// const API_BASE = "http://localhost:3000/api";
// const SOCKET_URL = "http://localhost:3000";
const API_BASE = "https://gigflow-backend-8ili.onrender.com/api";
const SOCKET_URL = "https://gigflow-backend-8ili.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const FreelancerDashboard = () => {
  /* ---------- STATES ---------- */
  const [requirements, setRequirements] = useState([]);
  const [bids, setBids] = useState([]);
  const [activeReq, setActiveReq] = useState(null);
  const [bidData, setBidData] = useState({ amount: "", message: "" });
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("userId");

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      }),
    []
  );

  const fetchRequirements = async () => {
    try {
      const res = await api.get("/bids/requirements/all");
      // ✅ Ensure array
      setRequirements(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch requirements error:", err);
      setRequirements([]);
    }
  };

  const fetchMyBids = async () => {
    try {
      const res = await api.get("/bids/my");
      setBids(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch bids error:", err);
      setBids([]);
    }
  };

  useEffect(() => {
    fetchRequirements();
    fetchMyBids();
  }, []);

  useEffect(() => {
    if (userId && userId !== "undefined") {
      socket.emit("register", userId);
      console.log("🟢 Socket registered:", userId);
    }

    socket.on("hired", (data) => {
      setNotification(`🎉 You have been hired for "${data.projectTitle}"`);
      fetchRequirements();
      fetchMyBids();
    });

    return () => {
      socket.off("hired");
      socket.disconnect();
    };
  }, [socket]);

  const placeBid = async () => {
    if (!activeReq) return;

    await api.post(`/bids/${activeReq._id}`, bidData);
    setBidData({ amount: "", message: "" });
    setActiveReq(null);
    fetchMyBids();
  };

  const deleteBid = async (bidId) => {
    await api.delete(`/bids/${bidId}`);
    fetchMyBids();
  };

  const filteredRequirements = useMemo(() => {
    if (!Array.isArray(requirements)) return [];

    return requirements.filter(
      (req) =>
        req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requirements, searchTerm]);

  return (
    <>
      <FreelancerNavbar />

      <div className={styles.container}>
        {/* 🔔 NOTIFICATION */}
        {notification && (
          <div className={styles.notification}>{notification}</div>
        )}

        {/* 🔍 SEARCH */}
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 📌 PROJECTS */}
        <h2 className={styles.heading}>Available Projects</h2>

        {filteredRequirements.length === 0 && (
          <p className={styles.empty}>No projects found</p>
        )}

        <div className={styles.grid}>
          {filteredRequirements.map((req) => (
            <div key={req._id} className={styles.card}>
              <h4>{req.title}</h4>
              <p>{req.description}</p>
              <span className={styles.budget}>₹ {req.budget}</span>

              {req.status === "open" ? (
                <button
                  className={styles.bidBtn}
                  onClick={() => setActiveReq(req)}
                >
                  Place Bid
                </button>
              ) : (
                <span className={styles.assigned}>Assigned</span>
              )}
            </div>
          ))}
        </div>

        {/* 🧾 MY BIDS */}
        <h2 className={styles.heading}>My Bids</h2>

        {bids.length === 0 && (
          <p className={styles.empty}>You haven’t placed any bids yet</p>
        )}

        <div className={styles.bidGrid}>
          {bids.map((bid) => (
            <div key={bid._id} className={styles.bidCard}>
              <h4>
                {bid.requirementId
                  ? bid.requirementId.title
                  : "Requirement removed"}
              </h4>

              <p>
                <strong>Bid:</strong> ₹{bid.amount}
              </p>
              <p className={styles.message}>{bid.message}</p>

              {bid.status === "pending" && (
                <div className={styles.bidActions}>
                  <span className={styles.pending}>Pending</span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteBid(bid._id)}
                  >
                    Delete
                  </button>
                </div>
              )}

              {bid.status === "hired" && (
                <span className={styles.hired}>🎉 Hired</span>
              )}

              {bid.status === "rejected" && (
                <span className={styles.rejected}>Rejected</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 📝 BID MODAL */}
      {activeReq && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <h3>Bid for {activeReq.title}</h3>

            <input
              type="number"
              placeholder="Bid Amount"
              value={bidData.amount}
              onChange={(e) =>
                setBidData({ ...bidData, amount: e.target.value })
              }
            />

            <textarea
              placeholder="Why should client hire you?"
              value={bidData.message}
              onChange={(e) =>
                setBidData({ ...bidData, message: e.target.value })
              }
            />

            <div className={styles.modalActions}>
              <button onClick={placeBid}>Submit</button>
              <button onClick={() => setActiveReq(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreelancerDashboard;
