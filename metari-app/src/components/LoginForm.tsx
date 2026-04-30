export default function LoginForm() {
  return (
    <>
      <div className="card form-card text-center p-5">
        <figure>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/330px-Placeholder_view_vector.svg.png"
            className="img-thumbnail"
            alt="img-thumbnail"
          ></img>
        </figure>
        <header className="mt-2">
          <h1>Metari</h1>
          <h3 className="text-muted">
            Torna a lluitar per tot el que vols aconseguir
          </h3>
        </header>

        <div className="mt-4">
          <form>
            <div className="row mb-2">
              <label
                className="form-label text-start"
                htmlFor="email_or_username"
              >
                Nom d'usuari o email <span className="text-danger">*</span>
              </label>
              <input
                className="form-control mb-2"
                type="text"
                name="email_or_username"
                id="email_or_username"
              />
            </div>

            <div className="row mb-2">
              <label className="form-label text-start" htmlFor="password">
                Contrasenya <span className="text-danger">*</span>
              </label>
              <input
                className="form-control mb-2"
                type="password"
                name="password"
                id="password"
              />
            </div>

            <div className="row mb-4">
              <a href="" className="text-start">
                Has oblidat la teva contrasenya?
              </a>
            </div>

            <div className="row mb-2 text-start">
              <div className="col-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="remember_password"
                  id="remember_password"
                />
              </div>

              <div className="col-5">
                <label className="form-check-label" htmlFor="remember_password">
                  Recordar contrasenya
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-5 mt-3">
              <a href="" className="text-start">
                Has oblidat la teva contrasenya?
              </a>
              <button type="submit" className="btn btn-dark">
                Inicia sessió
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
