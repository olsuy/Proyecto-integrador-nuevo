import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./Logout.css";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
  };

  return (
    <div className="logout-wrap">
      <button className="logout-btn" onClick={handleLogout}>
        <span className="logout-sign">
          <LogOut size={18} strokeWidth={2.5} />
        </span>
        <span className="logout-text">Logout</span>
      </button>
    </div>
  );
}

export default Logout;