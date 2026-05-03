import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  return <h1>Profile Page</h1>
}