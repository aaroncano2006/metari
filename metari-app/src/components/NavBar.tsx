import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getUserRole } from "../services/auth/loginService";

export function NavBar() {
  const [_recharge, setRecharge] = useState(0);
  const token = localStorage.getItem("token");
  const role = getUserRole();

  useEffect(() => {
    const handleRecharge = () => setRecharge(cur => cur + 1);
    window.addEventListener("authChange", handleRecharge);
    return () => window.removeEventListener("authChange", handleRecharge);
  }, []);

  return (
    <>
      <div className="navBar">
        <Link to="/" className="nav-btn">
          Home
        </Link>
        {token && (
          <Link to="/Profile" className="nav-btn">
            Perfil
          </Link>
        )}
        {!token && (
          <Link to="/Login" className="nav-btn">
            Login
          </Link>
        )}
        {!token && (
          <Link to="/Register" className="nav-btn">
            Registra't
          </Link>
        )}
        {token && (
          <Link to="/Logout" className="nav-btn">
            Logout
          </Link>
        )}
        {token && role === "admin" && (
          <Link to="/Admin" className="nav-btn">
            Panell Admin
          </Link>
        )}
      </div>
    </>
  );
}
