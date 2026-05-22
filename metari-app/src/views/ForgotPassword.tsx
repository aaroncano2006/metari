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
      <div className="container-fluid">
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-5">
            {/* <LoginForm></LoginForm> */}
            <ForgotPasswordForm></ForgotPasswordForm>
          </div>
        </div>
      </div>
    </>
  );
}