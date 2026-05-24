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
      <div className="container">
        <div className="row mt-5 d-flex justify-content-center mb-5">
          <div className="col-12 col-sm-10 col-md-8 col-xl-6 color1 bg-form">
            <RestorePasswordForm></RestorePasswordForm>
          </div>
        </div>
      </div>
    </>
  );
}