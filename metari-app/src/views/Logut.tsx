import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      localStorage.removeItem("token");
    }

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  }, []);

  return <></>;
}
