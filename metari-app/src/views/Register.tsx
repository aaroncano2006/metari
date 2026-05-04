import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

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
