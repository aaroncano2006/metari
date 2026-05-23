import LoginForm from "../components/LoginForm";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Metari · Login</title>
      </Helmet>
      <div className="container">
        <div className="row mt-5 d-flex justify-content-center mb-5">
          <div className="col-12 col-sm-10 col-md-8 col-xl-6 color1 bg-form ">
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </>
  );
}
