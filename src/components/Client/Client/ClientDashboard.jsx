import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import ClientNavbar from "../Cnavbar/Cnavbar";
import styles from "../Client/ClientDashboard.module.css";

const API_BASE = "https://gigflow-backend-8ili.onrender.com/api";
const SOCKET_URL = "https://gigflow-backend-8ili.onrender.com";
// const API_BASE = "http://localhost:3000/api";
// const SOCKET_URL = "http://localhost:3000";
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

const ClientDashboard = () => {
  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);
  const [openReqId, setOpenReqId] = useState(null);

  const userId = localStorage.getItem("userId");

  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        auth: { token: localStorage.getItem("token") },
      }),
    []
  );

  const fetchRequirements = async () => {
    const res = await api.get("/requirements/my-with-bids");
    setRequirements(res.data);
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  useEffect(() => {
    if (userId) {
      socket.emit("register", userId);
    }

    socket.on("newBid", (data) => {
      setRequirements((prev) =>
        prev.map((req) =>
          req._id === data.requirementId
            ? { ...req, bids: [...req.bids, data.bid] }
            : req
        )
      );
    });

    return () => {
      socket.off("newBid");
      socket.disconnect();
    };
  }, [socket]);

  const submit = async (e) => {
    e.preventDefault();

    if (editId) {
      await api.put(`/requirements/${editId}`, form);
    } else {
      await api.post("/requirements", form);
    }

    setForm({ title: "", description: "", budget: "", deadline: "" });
    setEditId(null);
    fetchRequirements();
  };

  const edit = (r) => {
    setForm({
      title: r.title,
      description: r.description,
      budget: r.budget,
      deadline: r.deadline,
    });
    setEditId(r._id);
  };

  const del = async (id) => {
    await api.delete(`/requirements/${id}`);
    fetchRequirements();
  };

  const hireBid = async (bidId) => {
    await api.post(`/requirements/hire/${bidId}`);
    fetchRequirements();
  };

  const toggleBids = (reqId) => {
    setOpenReqId(openReqId === reqId ? null : reqId);
  };

  return (
    <>
      <ClientNavbar />

      <div className={styles.container}>
        <div className={styles.formCard}>
          <h2>{editId ? "Edit Requirement" : "Post New Requirement"}</h2>

          <form onSubmit={submit} className={styles.form}>
            <input
              placeholder="Project Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <textarea
              placeholder="Project Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />

            <div className={styles.row}>
              <input
                type="number"
                placeholder="Budget (₹)"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                required
              />

              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                required
              />
            </div>

            <button className={styles.primaryBtn}>
              {editId ? "Update Requirement" : "Post Requirement"}
            </button>
          </form>
        </div>

        <div className={styles.grid}>
          {requirements.map((r) => (
            <div key={r._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{r.title}</h3>
                <span className={styles.budget}>₹ {r.budget}</span>
              </div>

              <p className={styles.desc}>{r.description}</p>

              <div className={styles.actions}>
                <button onClick={() => edit(r)}>Edit</button>
                <button onClick={() => del(r._id)}>Delete</button>

                <button
                  className={styles.viewBidsBtn}
                  onClick={() => toggleBids(r._id)}
                >
                  {openReqId === r._id
                    ? "Hide Bids"
                    : `View Bids (${r.bids.length})`}
                </button>
              </div>

              {openReqId === r._id && (
                <div className={styles.bidsWrapper}>
                  {r.bids.length === 0 && (
                    <p className={styles.noBids}>No bids yet</p>
                  )}

                  {r.bids.map((bid) => (
                    <div key={bid._id} className={styles.bidCard}>
                      <div className={styles.bidHeader}>
                        <strong>{bid.freelancerId.name}</strong>
                        <span>₹ {bid.amount}</span>
                      </div>

                      <p>{bid.message}</p>

                      {r.status === "open" &&
                        bid.status === "pending" && (
                          <button
                            className={styles.hireBtn}
                            onClick={() => hireBid(bid._id)}
                          >
                            Hire
                          </button>
                        )}

                      {bid.status === "hired" && (
                        <span className={styles.hired}>Hired</span>
                      )}

                      {bid.status === "rejected" && (
                        <span className={styles.rejected}>Rejected</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientDashboard;
