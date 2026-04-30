import LoginForm from "../components/LoginForm";

export default function Login() {
  return(
    <>
      <div className="container-fluid">
        <div className="row mt-5 d-flex justify-content-center">
          <div className="col-5">
            <LoginForm></LoginForm>
          </div>
        </div>
      </div>
    </>
    )
}