import "./Nav.css";
import logo from "../Nav/logo.jpeg";
import { NavLink } from "react-router-dom";
import Logout from "../Logout/Logout";


function Nav() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="menu">
        <li>
          <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink to="/monitoring" className={({ isActive }) => isActive ? "active-link" : ""}>
            MONITORING
          </NavLink>
        </li>
        <li>
          <NavLink to="/elevators" className={({ isActive }) => isActive ? "active-link" : ""}>
            ELEVATORS
          </NavLink>
        </li>
        <li>
          <NavLink to="/plc-scada" className={({ isActive }) => isActive ? "active-link" : ""}>
            PLC/SCADA
          </NavLink>
        </li>
        <li>
          <NavLink to="/system" className={({ isActive }) => isActive ? "active-link" : ""}>
            SYSTEM
          </NavLink>
        </li>
        <li>
          <NavLink to="/support" className={({ isActive }) => isActive ? "active-link" : ""}>
            SUPPORT
          </NavLink>
        </li>
      </ul>

      <Logout />
    </nav>
  );
}

export default Nav;