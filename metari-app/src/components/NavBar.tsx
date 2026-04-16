import { Link } from "react-router-dom";

export function NavBar() {

    return (
    <>
     <div>
      <Link to="/" className="btn btn-primary">
        Home
      </Link>
      <Link to="/Profile" className="btn btn-secondary">
        Perfil
      </Link>
      <Link to="/Login" className="btn btn-secondary">
        Login
      </Link>
      <Link to="/Register" className="btn btn-secondary">
        Registra't
      </Link>
     </div>
    </>
  );
}