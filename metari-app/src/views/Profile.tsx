import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfilePicture } from "../components/UserProfilePicture";
import {
  getUserFullName,
  getUserName,
  getUserStats,
} from "../services/auth/loginService";
import UserProfileForm from "../components/UserProfileForm";
import UserProfileStats from "../components/UserProfileStats";

export default function Profile() {
  const navigate = useNavigate();
  const name = getUserFullName();
  const username = getUserName();
  const stats = getUserStats();
  const [_recharge, setRecharge] = useState(0);

  useEffect(() => {
    const handleRecharge = () => setRecharge((cur) => cur + 1);
    window.addEventListener("profileChange", handleRecharge);
    return () => window.removeEventListener("profileChange", handleRecharge);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="container-fluid p-3">
        <header className="ms-5 p-5">
          <h1>Profile</h1>
        </header>

        <div className="row ms-5">
          <div className="col-md-4">
            <UserProfilePicture
              url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwo8eJYb8h6_V7THlADVmoSbVkJQw6k08Liw&s"
              id="userProfilePictureFromPage"
            />
            <div className="mt-3">
              <h2>{name}</h2>
              <h3>{username}</h3>
            </div>
          </div>
          <div className="col-md-5">
            <UserProfileForm></UserProfileForm>
          </div>
          <div className="col-md-2">
            <UserProfileStats
              completed_tasks={stats?.completed_tasks}
              score={stats?.score}
            ></UserProfileStats>
          </div>
        </div>
      </div>
    </>
  );
}
