import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { getUserRole, getUserName } from "../services/auth/loginService";

export function NavBar() {
  const [_recharge, setRecharge] = useState(0);
  const token = localStorage.getItem("token");
  const role = getUserRole();
  const username = getUserName();
  // const vistaActual = useLocation().pathname;

  useEffect(() => {
    const handleRecharge = () => setRecharge(cur => cur + 1);
    window.addEventListener("authChange", handleRecharge);
    return () => window.removeEventListener("authChange", handleRecharge);
  }, []);

  return (
    <>
      <div className="navBar ps-4 pe-4">
        <Link to="/" className="nav-btn me-auto">
          Home
        </Link>

        {!token && (
          <Link to="/login" className="nav-btn">
            Login
          </Link>
        )}
        {!token && (
          <Link to="/register" className="nav-btn">
            Registra't
          </Link>
        )}
        
        {token &&
          <>
            <Link to="/mymetas" className="nav-btn">
              Les meves metas
            </Link>
            <Link to="/mygroups" className="nav-btn">
              Els meus grups
            </Link>
          </>
        }

        {token && (
          <div className="btn-group">
            <button type="button" className="text-white btn color dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              {username}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link to="/profile" className="dropdown-item">
                  Perfil
                </Link>
              </li>
              <li>
                <Link to="/logout" className="dropdown-item">
                  Logout
                </Link>
              </li>
              {token && role === "admin" && (
                <li><Link to="/admin" className="dropdown-item">
                  Panell Admin
                </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
