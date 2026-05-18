import { useEffect, useState } from "react";
import { fetchGroupUsers } from "../../services/groupUserService";
import { updateGroup } from "../../services/groupService";
import type { groupType } from "../../types/groupType";
import type { groupUserType } from "../../types/groupUserType";
import { groupSchema } from "../../schemas/groupSchema";

type ModalGroupModeratorPanelProps = {
  group: groupType;
  setEditGroup: React.Dispatch<React.SetStateAction<groupType | null>>;
  setter: React.Dispatch<React.SetStateAction<groupType[]>>;
  defaultMenu?: "users" | "metas" | "group_config";
};

export default function ModalGroupModeratorPanel({
  group,
  setEditGroup,
  setter,
  defaultMenu,
}: ModalGroupModeratorPanelProps) {
  const [groupUsers, setGroupUsers] = useState<groupUserType[]>([]);
  const [menu, setMenu] = useState<"users" | "metas" | "group_config">(
    defaultMenu ?? "group_config",
  );
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

  const [title, setTitle] = useState(group.name);

  const [groupFormData, setGroupFormData] = useState({
    name: group.name,
    description: group.description,
    is_public: group.is_public,
  });

  useEffect(() => {
    fetchGroupUsers().then((response) => {
      setGroupUsers(response.filter((el) => el.group_id === group.id));
    });
  }, [group]);

  const switchMenu = (menu: "users" | "metas" | "group_config") => {
    try {
      setMenu(menu);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleGroupSubmit = async (data: Partial<groupType>) => {
    setError(null);
    setSuccess(false);
    const validation = groupSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return setErrors(errors);
    }
    setErrors({});
    // setFeedback(null);

    try {
      const updatedGroup = await updateGroup(group.id, data);
      setTitle(updatedGroup.name);
      setGroupFormData({
        name: updatedGroup.name,
        description: updatedGroup.description,
        is_public: updatedGroup.is_public,
      });
      setter((prev) => prev.map((g) => (g.id === group.id ? updatedGroup : g)));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      // setFeedback({ type: "success", message: "Grup actualitzat correctament" });
    } catch (error: any) {
      setError(
        "Error actualitzant el grup! Revisa els teus permisos o l'estat del servidor!",
      );
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>{title} · Panell de moderació</h5>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                  <div className="alert alert-success">
                    S'ha actualitzat el grup correctament!
                  </div>
                )}

                <div className="row-sm mt-3 d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("group_config");
                    }}
                  >
                    Configuració del grup
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("users");
                    }}
                  >
                    Membres del grup
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("metas");
                    }}
                  >
                    Metas del grup
                  </button>
                </div>

                <div className="row">
                  {menu === "group_config" && (
                    <>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await handleGroupSubmit(groupFormData);
                        }}
                      >
                        <label htmlFor="name">Nom</label>
                        <input
                          className="form-control mb-2"
                          type="text"
                          value={groupFormData.name}
                          id="name"
                          onChange={(event) =>
                            setGroupFormData({
                              ...groupFormData,
                              name: event.target.value,
                            })
                          }
                        />
                        {errors.name && (
                          <small className="text-danger d-flex mb-2">
                            {errors.name}
                          </small>
                        )}

                        <label htmlFor="description">Descripcio</label>
                        <textarea
                          className="form-control mb-2"
                          value={groupFormData.description}
                          id="description"
                          onChange={(event) =>
                            setGroupFormData({
                              ...groupFormData,
                              description: event.target.value,
                            })
                          }
                        />
                        {errors.description && (
                          <small className="text-danger d-flex mb-2">
                            {errors.description}
                          </small>
                        )}

                        <label htmlFor="is_public">El grup es public?</label>
                        <input
                          className=" form-check mb-2"
                          type="checkbox"
                          id="is_public"
                          checked={groupFormData.is_public}
                          onChange={(event) =>
                            setGroupFormData({
                              ...groupFormData,
                              is_public: event.target.checked,
                            })
                          }
                        />

                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditGroup(null)}
                          >
                            Sortir
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Actualitza
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
