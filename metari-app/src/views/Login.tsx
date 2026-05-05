import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-5">
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </>
  );
}
