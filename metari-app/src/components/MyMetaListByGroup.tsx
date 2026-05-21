import type { metaType } from "../types/metaType";
import { useState, useEffect } from "react";
import { getUserRole, getUserId } from "../services/auth/loginService";
import { useLocation } from "react-router-dom";
import type { assignationType } from "../types/assignationType";
import type { groupType } from "../types/groupType";
import { ModalAddComment } from "./modals/ModalAddComment";
import { fetchComments, deleteComment } from "../services/commentService";
import type { commentType } from "../types/commentType";
import {
  updateAssignation,
  createAssignationCompletion,
} from "../services/assignationService";
import { ModalAddProof } from "./modals/ModalAddProof";
import type { proofType } from "../types/proofType";
import { deleteProof } from "../services/proofService";
import ModalGroupModeratorPanel from "./modals/ModalGroupModeratorPanel";

type MyMetaListProps = {
  assignations: assignationType[];
  groups: groupType[];
  setAssignations: React.Dispatch<React.SetStateAction<assignationType[]>>;
  setter: React.Dispatch<React.SetStateAction<groupType[]>>;
};

export function MyMetaListByGroup({
  assignations,
  groups,
  setAssignations,
  setter,
}: MyMetaListProps) {
  const [openEntityId, setOpenEntityId] = useState<number | null>(null);
  const [currentGroup, setCurrentGroup] = useState<groupType | null>(null);

  const openModeratorGroupPanel = (group: groupType) => {
    setCurrentGroup((prev) => (prev === group ? null : group));
  };

  const toggleEntity = (id: number) => {
    setOpenEntityId((prev) => (prev === id ? null : id));
  };

  const hasUserCompletedChallenge = (assignation: assignationType): boolean => {
    if (assignation.meta.type !== "challenge") return assignation.completed;
    return (
      assignation.assignationCompletions?.some(
        (ac) => ac.user_id === loggedInUserId && ac.is_Completed,
      ) ?? false
    );
  };

  const hasUserSentProof = (assignation: assignationType): boolean => {
    return (
      assignation.proofs?.some((p) => p.user_id === loggedInUserId) ?? false
    );
  };

  const getUserProof = (
    assignation: assignationType,
  ): proofType | undefined => {
    return assignation.proofs?.find((p) => p.user_id === loggedInUserId);
  };

  const token = localStorage.getItem("token");
  const role = getUserRole();
  const vistaActual = useLocation().pathname;
  // const canEdit = vistaActual !== "/" && role === "admin";
  const loggedInUserId = getUserId();
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCompletedByGroup, setShowCompletedByGroup] = useState<
    Record<number, boolean>
  >({});
  const [assignationToAddComment, setAssignationToAddComment] =
    useState<assignationType | null>(null);

  const [showCommentsForId, setShowCommentsForId] = useState<number | null>(null);
  const [comments, setComments] = useState<commentType[]>([]);
  const [comment, setcomment] = useState<commentType>();

  const [commentFormType, setcommentFormType] = useState<string | null>(null);
  const [assignationToAddProof, setAssignationToAddProof] =
    useState<assignationType | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      const data = await fetchComments();
      setComments(data);
    };
    loadComments();
  }, []);

  //filtrar grups del usuari owner i membre
  const myGroups = groups.filter(
    (group) =>
      group.owner_id === loggedInUserId ||
      group.groupUsers.some((gu) => gu.user_id === loggedInUserId),
  );

  const filteredAssignations = assignations.filter(a =>
    !a.meta.indexedMetas ||
    a.meta.indexedMetas.length === 0 ||
    a.meta.indexedMetas.some(im => im.is_community_approved === true || im.is_approved === true)
  )

  const assignationsByGroup = myGroups.map((group) => ({
    group,
    assignations: filteredAssignations.filter((a) => a.group_id === group.id),
  }));
  // .filter(item => item.assignations.length > 0)

  const groupAssignations = assignationsByGroup.map(
    ({ group, assignations }) => ({
      group,
      assignations,
      myAssignations: assignations
        .filter(
          (a) => a.user_id === loggedInUserId || a.meta.type === "challenge",
        )
        .filter(
          (a) =>
            showCompletedByGroup[group.id] || !hasUserCompletedChallenge(a),
        ),
      memberAssignations: assignations
        .filter((a) => a.user_id !== loggedInUserId && a.meta.type === "task")
        .filter((a) => showCompletedByGroup[group.id] || !a.completed),
    }),
  );

  return (
    <>
      {token && (
        <>
          {groupAssignations.map(
            ({ group, myAssignations, memberAssignations }) => (
              <div className="metaList mt-4" key={group.id}>
                <div className="d-flex align-items-center my-2 ps-4 pe-4 position-relative">
                  <div className="titolComponent">
                    Metes del grup: {group.name}
                  </div>
                  <div className="ms-auto">
                    {group.groupUsers.find((el) => el.user_id === getUserId() && el.role === "moderator") && (
                      <>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openModeratorGroupPanel(group)}>
                          <i className="bi bi-gear-fill"></i>
                        </button>
                      </>
                    )}
                    
                  </div>
                  {currentGroup?.id === group.id && (
                    <ModalGroupModeratorPanel group={group} setEditGroup={setCurrentGroup} setter={setter} defaultMenu="metas" />
                  )}
                </div>
                <hr className="m-0" />
                <div className="inline">
                  <div className="d-flex ps-3 pe-3 mt-2">
                    <div className=" d-flex w-100">
                      <div className="me-auto">Les meves metes</div>
                      <label
                        htmlFor={`showCompleted-${group.id}`}
                        className="me-2"
                      >
                        Mostrar completades
                      </label>
                      <input
                        type="checkbox"
                        id={`showCompleted-${group.id}`}
                        checked={showCompletedByGroup[group.id] ?? false}
                        onChange={(e) =>
                          setShowCompletedByGroup((prev) => ({
                            ...prev,
                            [group.id]: e.target.checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                  {myAssignations.length === 0 ? (
                    <p className="text-muted ps-3 py-2">
                      No hi han asignacions
                    </p>
                  ) : (
                    <ul className="ps-2 m-0 py-2">
                      {myAssignations.map((assignation) => (
                        <li key={assignation.id} className="m-0 p-0">
                          <div
                            className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                            onClick={() => {
                              toggleEntity(assignation.id);
                              setShowCommentsForId(null);
                            }}
                          >
                            <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                              <div className="me-auto">
                                {assignation.meta.title}
                              </div>
                              {hasUserCompletedChallenge(assignation) ===
                                true && (
                                <div className="badge bg-success">
                                  completada
                                </div>
                              )}
                              {assignation.meta.type === "challenge" &&
                                hasUserSentProof(assignation) && (
                                  <div className="badge bg-success ms-1">
                                    Proves enviades
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="metaDetailsBox my-0 me-3 ">
                            {openEntityId === assignation.id && (
                              <div className="metaDetails ps-2 py-2 d-flex flex-column">
                                <div>📌 Tipus:{assignation.meta.type}</div>
                                <div>
                                  📝 Descripció: {assignation.meta.description}
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

                                {/* <div>✔️ Estat: {assignation.completed ? "completada" : "pendent"}</div> */}

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
                                    
                              {(() => {
                                const isChallenge = assignation.meta.type === "challenge";
                                const isCompleted = isChallenge
                                  ? hasUserCompletedChallenge(assignation)
                                  : assignation.completed;
                                const userProof = getUserProof(assignation);
                                const isModOrOwner =
                                  group.owner_id === loggedInUserId ||
                                  group.groupUsers.some(
                                    (gu) =>
                                      gu.user_id === loggedInUserId &&
                                      gu.role === "moderator",
                                  );

                                return (
                                  <>
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
                                            ?.split(".")[0]}
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
                                            ?.split(".")[0]}
                                    </div>

                                    <div className="d-flex gap-2 align-self-end me-2 mt-2 mb-2 flex-wrap">
                                      {isCompleted ? (
                                        <div
                                          className="btn btn-warning"
                                          onClick={async () => {
                                            await updateAssignation(
                                              assignation.id,
                                              { completed: false },
                                            );
                                            setAssignations((prev) =>
                                              prev.map((a) =>
                                                a.id === assignation.id
                                                  ? { ...a, completed: false }
                                                  : a,
                                              ),
                                            );
                                          }}
                                        >
                                          Desmarcar completada
                                        </div>
                                      ) : (
                                        <>
                                          {isChallenge &&
                                            !assignation.needs_proofs && (
                                              <div
                                                className="btn btn-success"
                                                onClick={async () => {
                                                  const newCompletion =
                                                    await createAssignationCompletion(
                                                      assignation.id,
                                                      loggedInUserId!,
                                                      true,
                                                    );
                                                  setAssignations((prev) =>
                                                    prev.map((a) =>
                                                      a.id === assignation.id
                                                        ? {
                                                            ...a,
                                                            assignationCompletions:
                                                              [
                                                                ...(a.assignationCompletions ??
                                                                  []),
                                                                newCompletion,
                                                              ],
                                                          }
                                                        : a,
                                                    ),
                                                  );
                                                }}
                                              >
                                                Marcar completada
                                              </div>
                                            )}
                                          {!isChallenge &&
                                            !assignation.needs_proofs && (
                                              <div
                                                className="btn btn-success"
                                                onClick={async () => {
                                                  await updateAssignation(
                                                    assignation.id,
                                                    { completed: true },
                                                  );
                                                  setAssignations((prev) =>
                                                    prev.map((a) =>
                                                      a.id === assignation.id
                                                        ? {
                                                            ...a,
                                                            completed: true,
                                                          }
                                                        : a,
                                                    ),
                                                  );
                                                }}
                                              >
                                                Marcar completada
                                              </div>
                                            )}
                                        </>
                                      )}

                                      {(isChallenge ||
                                        assignation.needs_proofs) && (
                                        <div
                                          className={`btn ${userProof ? "btn-info" : "btn-warning"}`}
                                          onClick={() =>
                                            setAssignationToAddProof(assignation)
                                          }
                                        >
                                          {userProof
                                            ? "Editar o veure prova"
                                            : "Enviar prova"}
                                        </div>
                                      )}
                                      {userProof && (
                                        <div
                                          className="btn btn-danger"
                                          onClick={async () => {
                                            if (
                                              !confirm(
                                                "Estàs segur que el vols eliminar?",
                                              )
                                            )
                                              return;
                                            await deleteProof(userProof.id);
                                            setAssignations((prev) =>
                                              prev.map((a) =>
                                                a.id === assignation.id
                                                  ? {
                                                      ...a,
                                                      proofs:
                                                        a.proofs?.filter(
                                                          (p) =>
                                                            p.id !==
                                                            userProof.id,
                                                        ),
                                                    }
                                                  : a,
                                              ),
                                            );
                                          }}
                                        >
                                          Elimina prova
                                        </div>
                                      )}
                                      <div
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setShowCommentsForId(
                                            showCommentsForId ===
                                              assignation.id
                                              ? null
                                              : assignation.id,
                                          );
                                        }}
                                      >
                                        {showCommentsForId === assignation.id
                                          ? "Amagar comentaris"
                                          : "Mostrar comentaris"}
                                      </div>
                                      <div
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setAssignationToAddComment(
                                            assignation,
                                          );
                                          setcommentFormType("create");
                                          setcomment(undefined);
                                        }}
                                      >
                                        Nou comentari
                                      </div>
                                    </div>

                                    {showCommentsForId === assignation.id &&
                                      (() => {
                                        const filteredComments = comments
                                          .filter(
                                            (c) =>
                                              c.assignation_id ===
                                              assignation.id,
                                          )
                                          .sort(
                                            (a, b) =>
                                              new Date(
                                                b.created_at,
                                              ).getTime() -
                                              new Date(
                                                a.created_at,
                                              ).getTime(),
                                          );
                                        return (
                                          <div className="mt-2">
                                            {filteredComments.length > 0
                                              ? filteredComments.map((c) => (
                                                  <div
                                                    key={c.id}
                                                    className="border rounded p-2 mb-1 bg-white me-2"
                                                  >
                                                    <strong>
                                                      {c.user?.name ??
                                                        c.user_id}
                                                    </strong>
                                                    :{" "}
                                                    <span>{c.body}</span>
                                                    <br />
                                                    <small>
                                                      {new Date(
                                                        c.created_at,
                                                      ).toLocaleString("ca-ES")}
                                                      {c.created_at !==
                                                        c.updated_at && (
                                                        <>
                                                          {" "}
                                                          (editat:{" "}
                                                          {new Date(
                                                            c.updated_at,
                                                          ).toLocaleString(
                                                            "ca-ES",
                                                          )}
                                                          )
                                                        </>
                                                      )}
                                                    </small>
                                                    <div className="d-flex justify-content-end gap-1 mt-1">
                                                      {c.user_id ===
                                                        getUserId() && (
                                                        <div
                                                          className="btn btn-warning btn-sm"
                                                          title="Editar comentari"
                                                          onClick={() => {
                                                            setcomment(c);
                                                            setAssignationToAddComment(
                                                              assignation,
                                                            );
                                                            setcommentFormType(
                                                              "edit",
                                                            );
                                                          }}
                                                        >
                                                          <i className="bi bi-pencil"></i>
                                                        </div>
                                                      )}
                                                      {(c.user_id ===
                                                        getUserId() ||
                                                        group.owner_id ===
                                                          getUserId()) && (
                                                        <div
                                                          className="btn btn-danger btn-sm"
                                                          title="Eliminar comentari"
                                                          onClick={async () => {
                                                            if (
                                                              !confirm(
                                                                "Estàs segur que el vols eliminar?",
                                                              )
                                                            )
                                                              return;
                                                            await deleteComment(
                                                              c.id,
                                                            );
                                                            setComments(
                                                              (prev) =>
                                                                prev.filter(
                                                                  (cc) =>
                                                                    cc.id !==
                                                                    c.id,
                                                                ),
                                                            );
                                                          }}
                                                        >
                                                          <i className="bi bi-trash"></i>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                ))
                                              : null}
                                          </div>
                                        );
                                      })()}
                                  </>
                                );
                              })()}
                            </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="me-auto ms-3">
                    Metes dels integrants del grup
                  </div>
                  {memberAssignations.length === 0 ? (
                    <p className="text-muted ps-3 py-2">
                      No hi han asignacions
                    </p>
                  ) : (
                    <ul className="ps-2 m-0 py-2">
                      {memberAssignations.map((assignation) => (
                        <li key={assignation.id} className="m-0 p-0">
                          <div
                            className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                            onClick={() => toggleEntity(assignation.id)}
                          >
                            <div className="d-flex py-1 ps-2 pe-3 align-items-center">
                              <div className="me-auto">
                                {assignation.meta.title}
                              </div>
                              {assignation.completed === true && (
                                <div className="badge bg-success">
                                  completada
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="metaDetailsBox my-0 me-3">
                            {openEntityId === assignation.id && (
                              <div className="metaDetails ps-2 py-2">
                                <div>📌 Tipus:{assignation.meta.type}</div>
                                <div>
                                  📝 Descripció: {assignation.meta.description}
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

                                {(() => {
                                  const isModOrOwner =
                                    group.owner_id === loggedInUserId ||
                                    group.groupUsers.some(
                                      (gu) =>
                                        gu.user_id === loggedInUserId &&
                                        gu.role === "moderator",
                                    );
                                  if (!isModOrOwner) return null;

                                  return (
                                    <div className="d-flex gap-2 align-self-end me-2 mt-2">
                                      <div
                                        className={`btn ${assignation.completed ? "btn-warning" : "btn-success"}`}
                                        onClick={async () => {
                                          await updateAssignation(
                                            assignation.id,
                                            { completed: !assignation.completed },
                                          );
                                          setAssignations((prev) =>
                                            prev.map((a) =>
                                              a.id === assignation.id
                                                ? {
                                                    ...a,
                                                    completed:
                                                      !assignation.completed,
                                                  }
                                                : a,
                                            ),
                                          );
                                        }}
                                      >
                                        {assignation.completed
                                          ? "Desmarcar completada"
                                          : "Marcar completada"}
                                      </div>
                                      <div
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setShowCommentsForId(
                                            showCommentsForId ===
                                              assignation.id
                                              ? null
                                              : assignation.id,
                                          );
                                        }}
                                      >
                                        {showCommentsForId === assignation.id
                                          ? "Amagar comentaris"
                                          : "Mostrar comentaris"}
                                      </div>
                                      <div
                                        className="btn btn-primary"
                                        onClick={() => {
                                          setAssignationToAddComment(assignation);
                                          setcommentFormType("create");
                                        }}
                                      >
                                        Nou comentari
                                      </div>
                                    </div>
                                  );
                                })()}

                                {showCommentsForId === assignation.id &&
                                  (() => {
                                    const filteredComments = comments
                                      .filter(
                                        (c) =>
                                          c.assignation_id === assignation.id,
                                      )
                                      .sort(
                                        (a, b) =>
                                          new Date(b.created_at).getTime() -
                                          new Date(a.created_at).getTime(),
                                      );
                                    return filteredComments.length > 0 ? (
                                      filteredComments.map((c) => (
                                        <div
                                          key={c.id}
                                          className="border rounded p-2 mb-1 bg-white me-2"
                                        >
                                          <strong>
                                            {c.user?.name ?? c.user_id}
                                          </strong>
                                          : <span>{c.body}</span>
                                          <br />
                                          <small>
                                            {new Date(
                                              c.created_at,
                                            ).toLocaleString("ca-ES")}
                                            {c.created_at !==
                                              c.updated_at && (
                                              <>
                                                {" "}
                                                (editat:{" "}
                                                {new Date(
                                                  c.updated_at,
                                                ).toLocaleString("ca-ES")}
                                                )
                                              </>
                                            )}
                                          </small>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-muted">
                                        No hi ha comentaris
                                      </p>
                                    );
                                  })()}

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
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ),
          )}
        </>
      )}
      {assignationToAddComment && (
        <ModalAddComment
          assignation={assignationToAddComment}
          assignationSetter={setAssignationToAddComment}
          commentSetter={setComments}
          commentFormType={commentFormType}
          comment={comment}
        />
      )}
      {assignationToAddProof && (
        <ModalAddProof
          assignation={assignationToAddProof}
          existingProof={getUserProof(assignationToAddProof)}
          assignationSetter={setAssignationToAddProof}
          setAssignations={setAssignations}
        />
      )}
    </>
  );
}