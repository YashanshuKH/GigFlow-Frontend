import { useState } from "react";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";

const Auth = () => {
  const [page, setPage] = useState("login");

  return page === "login" ? (
    <Login onSwitchToSignup={() => setPage("signup")} />
  ) : (
    <Signup onSwitchToLogin={() => setPage("login")} />
  );
};

export default Auth;
