// import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { Helmet } from "react-helmet-async";

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    // const restoreToken = sessionStorage.getItem("restore-token");

    if (token) {
      navigate("/");
    }

    // if (restoreToken) {
    //     navigate("/restore-password");
    // }
  }, []);

  return (
    <>
      <Helmet>
        <title>Metari · Has oblidat la contrasenya?</title>
      </Helmet>
      <div className="container">
        <div className="row mt-5 d-flex justify-content-center mb-5">
          <div className="col-12 col-sm-10 col-md-8 col-xl-6 color1 bg-form">
            <ForgotPasswordForm></ForgotPasswordForm>
          </div>
        </div>
      </div>
    </>
  );
}