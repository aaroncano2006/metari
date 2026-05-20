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
import {
  fetchIndexedMetas,
  deleteIndexedMeta,
} from "../../services/IndexerService";
import {
  fetchAssignations,
  deleteAssignation,
} from "../../services/assignationService";
import { PendingIndexedMetas } from "../PendingIndexedMetas";
import type { metaType } from "../../types/metaType";
import type { assignationType } from "../../types/assignationType";
import { fetchMetas, deleteMeta } from "../../services/metaService";
import { search as searchUsers } from "../../services/searchService";
import { sendInvitation } from "../../services/invitationService";
import type { userTypeFrontend } from "../../types/userTypeFrontend";

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
  const [currentAssignationId, setCurrentAssignationId] = useState<
    number | null
  >(0);

  const [inviteUsername, setInviteUsername] = useState("");
  const [inviteMenuActive, setInviteMenuActive] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

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

  const handleInviteByUsername = async () => {
    setInviteError(null);
    setInviteSuccess(null);
    if (!inviteUsername.trim()) return;
    try {
      const results = await searchUsers(inviteUsername);
      const users = results.users || [];
      const user =
        users.find(
          (u: userTypeFrontend) =>
            u.username.toLowerCase() === inviteUsername.toLowerCase() ||
            u.name.toLowerCase() === inviteUsername.toLowerCase(),
        ) || users[0];
      if (!user) {
        return setInviteError("Usuari no trobat!");
      }
      if (groupUsers.some((gu) => gu.user_id === user.id)) {
        return setInviteError("Aquest usuari ja és membre del grup!");
      }
      const userId = getUserId();
      if (!userId) return;
      await sendInvitation(userId, user.id, group.id);
      setInviteSuccess(`Invitació enviada a ${user.name} (${user.username})`);
      setInviteUsername("");
      window.dispatchEvent(new Event("buttonChange"));
      setTimeout(() => setInviteSuccess(null), 5000);
    } catch {
      setInviteError("Error enviant la invitació!");
    }
  };

  const handleRemoveMeta = async (assignationId: number) => {
    setError(null);
    setSuccess(false);
    const targetAssignation = assignations.find((a) => a.id === assignationId);
    if (!targetAssignation) return;
    const targetMeta = metas.find((m) => m.id === targetAssignation.meta_id);
    try {
      await deleteAssignation(assignationId);
      if (targetMeta && !targetMeta.is_public) {
        const metaIndexedMetas = indexedMetas.filter(
          (im) => im.meta_id === targetMeta.id,
        );
        await Promise.all(
          metaIndexedMetas.map((im) => deleteIndexedMeta(im.id)),
        );
        await deleteMeta(targetMeta.id);
      }
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

  const toggleAssingationDetail = (assignationId: number) => {
    setCurrentAssignationId((prev) =>
      prev === assignationId ? null : assignationId,
    );
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

                <div className="row-sm mt-4 mb-2 d-flex justify-content-center gap-3">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("group_config");
                    }}
                  >
                    <i className="bi bi-gear-fill me-1"></i> Configuració del
                    grup
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("users");
                    }}
                  >
                    <i className="bi bi-people-fill me-1"></i> Membres del grup
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      switchMenu("metas");
                    }}
                  >
                    <i className="bi bi-bullseye me-1"></i>Metas del grup
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
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="m-0">
                          Membres del grup ({groupUsers.length})
                        </h6>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setInviteMenuActive(!inviteMenuActive)}
                        >
                          <i className="bi bi-person-plus-fill me-1"></i>
                          Invitar
                        </button>
                      </div>

                      {inviteMenuActive && (
                        <div className="mb-3 p-2 border rounded bg-light">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder="Username del usuari..."
                              value={inviteUsername}
                              onChange={(e) =>
                                setInviteUsername(e.target.value)
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleInviteByUsername()
                              }
                            />
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={handleInviteByUsername}
                            >
                              <i className="bi bi-send me-1"></i>Invitar
                            </button>
                          </div>
                          {inviteError && (
                            <small className="text-danger d-block mt-1">
                              {inviteError}
                            </small>
                          )}
                          {inviteSuccess && (
                            <small className="text-success d-block mt-1">
                              {inviteSuccess}
                            </small>
                          )}
                        </div>
                      )}

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
                                    <i className="bi bi-person-dash-fill"></i>{" "}
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
                            <>
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
                                    <>
                                      <button
                                        className="btn btn-warning btn-sm"
                                        title="Mostrar detalls i proves de l'assignació"
                                        onClick={() => {
                                          toggleAssingationDetail(
                                            assignation.id,
                                          );
                                        }}
                                      >
                                        <i className="bi bi-eye-fill"></i>
                                      </button>

                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                          handleRemoveMeta(assignation.id)
                                        }
                                        title="Eliminar del grup"
                                      >
                                        <i className="bi bi-trash-fill"></i>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </li>
                              {currentAssignationId === assignation?.id && (
                                <div className="bg-light ps-2 py-3 mb-2">
                                  <div>📌 Tipus:{assignation.meta.type}</div>
                                  <div>
                                    📝 Descripció:{" "}
                                    {assignation.meta.description}
                                  </div>
                                  {assignation.user_id && (
                                    <div>
                                      👤 Assignada a:{" "}
                                      {assignation.user?.name
                                        ? `${assignation.user?.name} (${assignation.user?.username})`
                                        : assignation.user_id}
                                    </div>
                                  )}
                                  {assignation.assigner_id && (
                                    <div>
                                      👑 Assignada per:{" "}
                                      {assignation.assigner?.name
                                        ? `${assignation.assigner?.name} (${assignation.assigner?.username})`
                                        : assignation.assigner_id}
                                    </div>
                                  )}
                                  <div>
                                    📅 Inici:{" "}
                                    {assignation.start_date
                                      ?.split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-")}
                                  </div>
                                  <div>
                                    ⏳ Data límit:{" "}
                                    {assignation.due_date
                                      ?.split("T")[0]
                                      .split("-")
                                      .reverse()
                                      .join("-") ?? "sense data limit"}
                                  </div>
                                  <div>
                                    🔥 Prioritat:{" "}
                                    {assignation.priority ?? "sense prioritat"}
                                  </div>

                                  {assignation.meta.type === "challenge" && (
                                    <div>
                                      🏆 Puntuacio: {assignation.score ?? 0}
                                    </div>
                                  )}

                                  {assignation.assignationCompletions &&
                                    assignation.assignationCompletions.length >
                                      0 && (
                                      <div>
                                        ✅ Completat per:{" "}
                                        {assignation.assignationCompletions
                                          .filter((ac) => ac.is_Completed)
                                          .map(
                                            (ac) =>
                                              ac.user?.username ?? ac.user_id,
                                          )
                                          .join(", ")}
                                      </div>
                                    )}

                                  {assignation.needs_proofs !== null &&
                                    assignation.needs_proofs !== undefined && (
                                      <div>
                                        📋 Requereix proves:{" "}
                                        {assignation.needs_proofs ? "Sí" : "No"}
                                      </div>
                                    )}

                                  {assignation.proofs && assignation.proofs.length > 0 && (
                                    <div className="mt-2">
                                      <div className="fw-bold">📋 Proves adjuntes ({assignation.proofs.length}):</div>
                                      {assignation.proofs.map((proof) => (
                                        <div
                                          key={proof.id}
                                          className="border rounded p-2 mb-1 bg-white"
                                          style={{ fontSize: "0.9rem" }}
                                        >
                                          <div className="d-flex justify-content-between align-items-center">
                                            <span className="fw-medium">
                                              {proof.user?.name ? `${proof.user?.name} (${proof.user?.username})` : "Usuari desconegut"}
                                            </span>
                                            <span>
                                              {proof.is_valid ? "✅ Vàlida" : "❌ Pendent"}
                                            </span>
                                          </div>
                                          <small className="text-muted">
                                            {proof.created_at?.split("T")[0].split("-").reverse().join("-") +
                                              " a les " +
                                              proof.created_at?.split("T")[1]?.split(".")[0]}
                                          </small>
                                          {proof.proof_type === "text" ? (
                                            <p className="mb-0 mt-1">{proof.proof}</p>
                                          ) : (
                                            <img
                                              src={proof.proof}
                                              alt="Prova"
                                              className="img-fluid mt-1"
                                              style={{ maxHeight: 150, objectFit: "contain" }}
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div>
                                    🆕 Creat el dia:{" "}
                                    {assignation.created_at &&
                                      assignation.created_at
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()
                                        .join("-") +
                                        " a les " +
                                        assignation.created_at
                                          .split("T")[1]
                                          .split(".")[0]}
                                  </div>
                                  <div>
                                    🔄 Actualitzat el dia:{" "}
                                    {assignation.updated_at &&
                                      assignation.updated_at
                                        .split("T")[0]
                                        .split("-")
                                        .reverse()
                                        .join("-") +
                                        " a les " +
                                        assignation.updated_at
                                          .split("T")[1]
                                          .split(".")[0]}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                      </ul>
                      <PendingIndexedMetas
                        indexedMetas={indexedMetas}
                        setIndexedMetas={setIndexedMetas}
                        isGroupModerating={true}
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
