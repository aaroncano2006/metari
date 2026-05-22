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
      <div className="container-fluid">
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-5">
            <RegisterForm></RegisterForm>
          </div>
        </div>
      </div>
    </>
  );
}
