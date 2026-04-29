import { Link } from "react-router-dom";

export function NavBar() {

    return (
    <>
     <div className="navBar">
      <Link to="/" className="nav-btn">
        Home
      </Link>
      <Link to="/Profile" className="nav-btn">
        Perfil
      </Link>
      <Link to="/Login" className="nav-btn">
        Login
      </Link>
      <Link to="/Register" className="nav-btn">
        Registra't
      </Link>
      <Link to="/Admin" className="nav-btn">
        Panell Admin
      </Link>
     </div>
    </>
  );
}