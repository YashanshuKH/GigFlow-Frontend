import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing/Landing";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import ClientDashboard from "./components/Client/Client/ClientDashboard";
import FreelancerDashboard from "./components/Freelancer/Freelancer/FreelancerDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/client-dashboard" element={<ClientDashboard />} />
      <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
    </Routes>
  );
}

export default App;
