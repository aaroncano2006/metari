import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserProfilePicture } from "../components/UserProfilePicture";
import { getUserFullName, getUserName } from "../services/auth/loginService";

export default function Profile() {
  const navigate = useNavigate();
  const name = getUserFullName();
  const username = getUserName();

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
          <div className="col-1">
            <UserProfilePicture url="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwo8eJYb8h6_V7THlADVmoSbVkJQw6k08Liw&s" id="userProfilePictureFromPage"/>
            <div className="mt-3">
              <h2>{name}</h2>
              <h3>{username}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}