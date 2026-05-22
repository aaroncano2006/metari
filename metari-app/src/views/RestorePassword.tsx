// import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RestorePasswordForm from "../components/RestorePasswordForm";
import { Helmet } from "react-helmet-async";

export default function RestorePassword() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Metari · Restableix la contrasenya</title>
      </Helmet>
      <div className="container-fluid">
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-5">
            <RestorePasswordForm></RestorePasswordForm>
          </div>
        </div>
      </div>
    </>
  );
}