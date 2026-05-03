import { Link } from "react-router-dom";

export function NavBar() {
  const token = localStorage.getItem("token");

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
        {
          token && (
          <Link to="/Logout" className="nav-btn">
            Logout
          </Link>
          )
        }
        <Link to="/Admin" className="nav-btn">
          Panell Admin
        </Link>
      </div>
    </>
  );
}
