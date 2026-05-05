import { useState } from "react"
import { createCategory } from "../../services/categoryService"
import { createMeta } from "../../services/metaService"

import type { categoryType } from "../../types/categoryType"
import type { metaType } from "../../types/metaType"
import type { userTypeFrontend } from "../../types/userTypeFrontend"


type ModalEditProps = {
  setCreatingEntry: React.Dispatch<React.SetStateAction<string | null>>
  creatingEntry: string
}

export function ModalCreate({ setCreatingEntry, creatingEntry }: ModalEditProps) {


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    let data: any = {};

    if (creatingEntry === "categories") {
      data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string
      };
      await createCategory(data);

    }
    if (creatingEntry === "metas") {
      data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        author_id: 1, //agafar segons usuari logejat
        group_id: 2, // select dels grups del usuari logejat
        category_id: formData.get("category_id") ? Number(formData.get("category_id")) : null,
        // type: ""
        // type: formData.get("type")?.toString().trim() ? formData.get("type") : undefined
        type: formData.get("type")
      };
      await createMeta(data);

    }
    if (creatingEntry === "usuaris") {
      data = {

      };
    }
    if (creatingEntry === "grups") {
      data = {

      };
    }
    setCreatingEntry(null)
  }


  const inputsFormulari = () => {
    if (creatingEntry === "metas") {
      
      //indexed access type
      const metaTypeOptions: metaType["type"][] = ["task", "challenge"];


      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="title">Títol</label>
            <input className="form-control mb-2" type="text" name="title" id="title" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="description">Descripció</label>
            <textarea className="form-control mb-2" name="description" id="description" />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="category_id">Categoria</label>
            <input className="form-control mb-2" type="text" name="category_id" id="category_id" />
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="type">Tipus</label>
            <select className="form-select mb-2" name="type" id="type">

              {metaTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </>
      );
    }

    if (creatingEntry === "categories") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="name">Nom</label>
            <input className="form-control mb-2" type="text" name="name" id="name" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="description">Descripcio</label>
            <textarea className="form-control mb-2" name="description" id="description" />
          </div>
        </>
      );
    }

    if (creatingEntry === "usuaris") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="username">Username</label>
            <input className="form-control mb-2" type="text" name="username" id="username" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="email">Email</label>
            <input className="form-control mb-2" type="text" name="email" id="email" />
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="role">Role</label>
            <input className="form-control mb-2" type="text" name="role" id="role" />
          </div>
        </>
      );
    }

    if (creatingEntry === "grups") {
      return (
        <>
          <div className="d-flex flex-column">
            <label htmlFor="group">nom</label>
            <input className="form-control mb-2" type="text" name="group" id="group" />
          </div>
        </>
      );
    }

    return null;
  };


  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea {creatingEntry}</h5>

                <form onSubmit={handleSubmit}
                >
                  {inputsFormulari()}

                  {/* <input className="form-control mb-2"
                    type="text" value={formData.name}
                    onChange={(event) =>
                      setFormData({ ...formData, name: event.target.value })
                    }
                  />*/}

                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingEntry(null)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Actualitza
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}