import { useEffect, useState } from "react";
import axios from "axios";
import ClientNavbar from "../Cnavbar/Cnavbar";
import styles from "../Client/ClientDashboard.module.css";

const API = "https://gigflow-backend-8ili.onrender.com/api/requirements";

const ClientDashboard = () => {
  const [requirements, setRequirements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [editId, setEditId] = useState(null);
  const [openReqId, setOpenReqId] = useState(null); // ✅ only one open at a time

  const token = localStorage.getItem("token");

  /* ---------------- FETCH REQUIREMENTS + BIDS ---------------- */
  const fetchRequirements = async () => {
    const res = await axios.get(`${API}/my-with-bids`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequirements(res.data);
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  /* ---------------- CREATE / UPDATE ---------------- */
  const submit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${API}/${editId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(API, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({ title: "", description: "", budget: "", deadline: "" });
    setEditId(null);
    fetchRequirements();
  };

  /* ---------------- EDIT ---------------- */
  const edit = (r) => {
    setForm({
      title: r.title,
      description: r.description,
      budget: r.budget,
      deadline: r.deadline,
    });
    setEditId(r._id);
  };

  /* ---------------- DELETE ---------------- */
  const del = async (id) => {
    await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchRequirements();
  };

  /* ---------------- HIRE ---------------- */
  const hireBid = async (bidId) => {
    if (!bidId) return;

    await axios.post(
      `https://gigflow-backend-8ili.onrender.com/api/requirements/hire/${bidId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchRequirements();
  };

  /* ---------------- TOGGLE BIDS ---------------- */
  const toggleBids = (reqId) => {
    setOpenReqId(openReqId === reqId ? null : reqId);
  };

  return (
    <>
      <ClientNavbar />

      <div className={styles.container}>
        {/* ---------------- FORM ---------------- */}
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

        {/* ---------------- REQUIREMENTS ---------------- */}
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

              {/* ---------------- BIDS (ONLY ONE OPEN) ---------------- */}
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
