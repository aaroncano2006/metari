// import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function Login() {
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