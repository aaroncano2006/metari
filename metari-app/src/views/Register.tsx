import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { Helmet } from "react-helmet-async";

export default function Register() {
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
        <title>Metari · Registra't</title>
      </Helmet>
      <div className="container">
        <div className="row mt-5 d-flex justify-content-center mb-5">
          <div className="col-12 col-sm-10 col-md-8 col-xl-6 color1 bg-form ">
            <RegisterForm></RegisterForm>
          </div>
        </div>
      </div>
    </>
  );
}
