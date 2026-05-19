import { useEffect, useState } from "react";
import {
  fetchGroupUsers,
  updateGroupUserRole,
  deleteGroupUser,
} from "../../services/groupUserService";
import { updateGroup } from "../../services/groupService";
import { getUserId } from "../../services/auth/loginService";
import type { groupType } from "../../types/groupType";
import type { groupUserType } from "../../types/groupUserType";
import { groupSchema } from "../../schemas/groupSchema";
import type { indexedType } from "../../types/indexedType";
import { fetchIndexedMetas } from "../../services/IndexerService";
import {
  fetchAssignations,
  deleteAssignation,
} from "../../services/assignationService";
import { PendingIndexedMetas } from "../PendingIndexedMetas";
import type { metaType } from "../../types/metaType";
import type { assignationType } from "../../types/assignationType";
import { fetchMetas } from "../../services/metaService";

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
  const [metas, setMetas] = useState<metaType[]>([]);
  const [assignations, setAssignations] = useState<assignationType[]>([]);
  const [indexedMetas, setIndexedMetas] = useState<indexedType[]>([]);

  const [menu, setMenu] = useState<"users" | "metas" | "group_config">(
    defaultMenu ?? "group_config",
  );
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<boolean>(false);

  const currentUserId = getUserId();
  const isOwner = group.owner_id === currentUserId;

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
    fetchAssignations().then((allAssignations) => {
      const groupAssignations = allAssignations.filter(
        (a) => a.group_id === group.id,
      );
      setAssignations(groupAssignations);
      const groupMetaIds = groupAssignations.map((a) => a.meta_id);
      fetchMetas().then((metas) => {
        setMetas(metas.filter((m) => groupMetaIds.includes(m.id)));
      });
      fetchIndexedMetas().then((indexedMetas) => {
        setIndexedMetas(
          indexedMetas.filter((im) => groupMetaIds.includes(im.meta_id)),
        );
      });
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
    } catch (error: any) {
      setError(
        "Error actualitzant el grup! Revisa els teus permisos o l'estat del servidor!",
      );
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    setError(null);
    setSuccess(false);
    try {
      await updateGroupUserRole(group.id, userId, role);
      setGroupUsers((prev) =>
        prev.map((gu) =>
          gu.user_id === userId
            ? { ...gu, role: role as "member" | "moderator" }
            : gu,
        ),
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error canviant el rol! Revisa els teus permisos.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTransferOwnership = async (userId: number) => {
    setError(null);
    setSuccess(false);
    try {
      const updatedGroup = await updateGroup(group.id, { owner_id: userId });
      setter((prev) => prev.map((g) => (g.id === group.id ? updatedGroup : g)));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error transferint la propietat! Revisa els teus permisos.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleKickUser = async (userId: number) => {
    setError(null);
    setSuccess(false);
    try {
      await deleteGroupUser(group.id, userId);
      setGroupUsers((prev) => prev.filter((gu) => gu.user_id !== userId));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error expulsant l'usuari! Revisa els teus permisos.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRemoveMeta = async (assignationId: number) => {
    setError(null);
    setSuccess(false);
    const targetAssignation = assignations.find((a) => a.id === assignationId);
    if (!targetAssignation) return;
    try {
      await deleteAssignation(assignationId);
      setAssignations((prev) => prev.filter((a) => a.id !== assignationId));
      setMetas((prev) =>
        prev.filter((m) => m.id !== targetAssignation.meta_id),
      );
      setIndexedMetas((prev) =>
        prev.filter((im) => im.meta_id !== targetAssignation.meta_id),
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error eliminant la meta del grup! Revisa els teus permisos.");
      setTimeout(() => setError(null), 3000);
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
                  {menu === "users" && (
                    <div className="mt-3">
                      <h6>Membres del grup ({groupUsers.length})</h6>
                      {groupUsers.length === 0 && (
                        <small className="text-muted">
                          No hi ha membres al grup.
                        </small>
                      )}
                      <ul className="p-0">
                        {groupUsers.map((gu) => (
                          <li
                            key={gu.user_id}
                            className="d-flex mb-2 p-2 border rounded m-0 bg-light justify-content-between"
                          >
                            <div>
                              <strong>{gu.user.name}</strong>
                              <span className="text-muted ms-2">
                                ({gu.user.username})
                              </span>
                              {gu.user_id === group.owner_id && (
                                <span className="badge bg-warning ms-2">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              {gu.user_id !== group.owner_id && (
                                <select
                                  value={gu.role}
                                  onChange={(e) =>
                                    handleRoleChange(gu.user_id, e.target.value)
                                  }
                                  className="form-select form-select-sm"
                                  style={{ width: "auto" }}
                                >
                                  <option value="member">Membre</option>
                                  <option value="moderator">Moderador</option>
                                </select>
                              )}
                              {isOwner &&
                                gu.user_id !== currentUserId &&
                                gu.user_id !== group.owner_id && (
                                  <button
                                    className="btn btn-warning btn-sm"
                                    onClick={() =>
                                      handleTransferOwnership(gu.user_id)
                                    }
                                  >
                                    Fer owner
                                  </button>
                                )}
                              {gu.user_id !== currentUserId &&
                                gu.user_id !== group.owner_id && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleKickUser(gu.user_id)}
                                  >
                                    Expulsar
                                  </button>
                                )}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setEditGroup(null)}
                        >
                          Sortir
                        </button>
                      </div>
                    </div>
                  )}
                  {menu === "metas" && (
                    <div className="mt-3">
                      <h6 className="mt-3">Metes del grup ({metas.length})</h6>
                      {metas.length === 0 && (
                        <small className="text-muted">
                          No hi ha metes assignades al grup.
                        </small>
                      )}
                      <ul className="p-0">
                        {metas.map((meta) => {
                          const assignation = assignations.find(
                            (a) => a.meta_id === meta.id,
                          );
                          return (
                            <li
                              key={meta.id}
                              className="d-flex mb-2 p-2 border rounded m-0 bg-light justify-content-between align-items-center"
                            >
                              <div>
                                <strong>{meta.title}</strong>
                                <span className="text-muted ms-2">
                                  {meta.type}
                                </span>
                                <br />
                                <small className="text-muted">
                                  {meta.category?.name} ·{" "}
                                  {meta.author?.username}
                                </small>
                              </div>
                              <div className="d-flex gap-2">
                                {assignation && (
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                      handleRemoveMeta(assignation.id)
                                    }
                                  >
                                    Eliminar del grup
                                  </button>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <PendingIndexedMetas
                        indexedMetas={indexedMetas}
                        setIndexedMetas={setIndexedMetas}
                      />

                      <div className="d-flex justify-content-end gap-2 mt-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setEditGroup(null)}
                        >
                          Sortir
                        </button>
                      </div>
                    </div>
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
