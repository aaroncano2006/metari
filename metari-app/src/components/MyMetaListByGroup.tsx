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
import { fetchUserById, updateUser } from "../services/userService";
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
        (ac) => ac.is_Completed,
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

  const [showComments, setShowComments] = useState(false);
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
                  <i className="bi bi-people-fill me-3 profileIcon text-primary"></i>
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
                {/* <hr className="m-0" /> */}
                <div className="inline">
                  <div className="d-flex ps-3 pe-3 mt-2">
                    <div className=" d-flex w-100">
                      <div className="me-auto fw-bold">Les meves metes</div>
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
                      Encara no hi ha assignacions.
                    </p>
                  ) : (
                    <ul className="ps-3 m-0 py-2">
                      {myAssignations.map((assignation) => (
                        <li key={assignation.id} className="m-0 p-0">
                          <div
                            className={`metaEntry mt-1 me-3 ps-2 ${openEntityId === assignation.id ? "mb-0" : "mb-1"} ${assignation.meta.type === "task" ? "meta-task" : "meta-challenge"}`}
                            onClick={() => {
                              toggleEntity(assignation.id);
                              setShowComments(false);
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
                              {
                                hasUserSentProof(assignation) && !hasUserCompletedChallenge(assignation) &&(
                                  <div className="badge bg-success ms-1">
                                    Proves enviades
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="metaDetailsBox my-0 me-3 ">
                            {openEntityId === assignation.id && (
                              <div className="metaDetails ps-2 py-2 d-flex flex-column">
                                <div>📌 <strong>Tipus:</strong>{assignation.meta.type}</div>
                                <div>
                                  📝 <strong>Descripció:</strong> {assignation.meta.description}
                                </div>
                                {assignation.user_id && (
                                  <div>
                                    👤 <strong>Assignada a:</strong>{" "}
                                    {assignation.user?.name
                                      ? `${assignation.user?.name} (${assignation.user?.username})`
                                      : assignation.user_id}
                                  </div>
                                )}
                                {assignation.assigner_id && (
                                  <div>
                                    👑 <strong>Assignada per:</strong>{" "}
                                    {assignation.assigner?.name
                                      ? `${assignation.assigner?.name} (${assignation.assigner?.username})`
                                      : assignation.assigner_id}
                                  </div>
                                )}
                                <div>
                                  📅 <strong>Inici:</strong>{" "}
                                  {assignation.start_date
                                    ?.split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join("-")}
                                </div>
                                <div>
                                  ⏳ <strong>Data límit:</strong>{" "}
                                  {assignation.due_date
                                    ?.split("T")[0]
                                    .split("-")
                                    .reverse()
                                    .join("-") ?? "sense data limit"}
                                </div>
                                <div>
                                  🔥 <strong>Prioritat:</strong>{" "}
                                  {assignation.priority ?? "sense prioritat"}
                                </div>

                                {assignation.meta.type === "challenge" && (
                                  <div>
                                    🏆 <strong>Puntuacio:</strong> {assignation.score ?? 0}
                                  </div>
                                )}

                                {/* <div>✔️ Estat: {assignation.completed ? "completada" : "pendent"}</div> */}

                                {assignation.assignationCompletions &&
                                  assignation.assignationCompletions.length >
                                    0 && (
                                    <div>
                                      ✅ <strong>Completat per:</strong>{" "}
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
                                const userProof = getUserProof(assignation)
                                return (
                                  <>
                                    
                                    {assignation.needs_proofs !== null &&
                                      assignation.needs_proofs !== undefined && (
                                        <div>
                                          📋 <strong>Requereix proves:</strong>{" "}
                                          {assignation.needs_proofs ? "Sí" : "No"}
                                        </div>
                                      )}

                                    <div>
                                      🆕 <strong>Creat el dia:</strong>{" "}
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
                                      🔄 <strong>Actualitzat el dia:</strong>{" "}
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
                                    <div className=" d-flex align-self-end me-2 mb-2 mt-2">
                                      <div
                                        className="btn btn-primary d-flex align-self-end me-2 "
                                        onClick={() => {
                                          setShowComments((prev) => !prev);
                                        }}
                                      >
                                        Mostrar comentaris
                                      </div>
                                      <div
                                        className="btn btn-primary align-self-end me-2 "
                                        onClick={() => {
                                          setAssignationToAddComment(assignation);
                                          setcommentFormType("create");
                                        }}
                                      >
                                        Nou comentari
                                      </div>
                                    </div>
                                  </>
                                )
                              })()}


                              {/* {!hasUserCompletedChallenge(assignation) && assignation.meta.type === "challenge" && assignation.needs_proofs === false && (
                                <div className="btn btn-success align-self-end me-2"
                                  onClick={async () => {
                                    const newCompletion = await createAssignationCompletion(assignation.id, loggedInUserId!, true)
                                    setAssignations(prev => prev.map(a =>
                                      a.id === assignation.id
                                        ? { ...a, assignationCompletions: [...(a.assignationCompletions ?? []), newCompletion] }
                                        : a
                                    ))
                                  }}>
                                  Marcar completada
                                </div>)} */}

                                
                                {!assignation.completed &&
                                  assignation.meta.type === "task" &&
                                  !assignation.needs_proofs && (
                                    <div
                                      className="btn btn-success align-self-end me-2"
                                      onClick={async () => {
                                        const updated = await updateAssignation(
                                          assignation.id,
                                          { completed: true },
                                        );
                                        const user = await fetchUserById(loggedInUserId!);
                                        const score = assignation.score ?? 0;
                                        await updateUser(loggedInUserId!, {
                                          completed_tasks: user.completed_tasks + 1,
                                          score: user.score + score,
                                        });
                                        setAssignations((prev) =>
                                          prev.map((a) =>
                                            a.id === assignation.id
                                              ? { ...a, completed: true }
                                              : a,
                                          ),
                                        );
                                      }}
                                    >
                                      Marcar task completada
                                    </div>
                                  )}

                                {(() => {
                                  const userProof = getUserProof(assignation);
                                  return (
                                    (assignation.meta.type === "challenge" || assignation.meta.type === "task") &&
                                    assignation.needs_proofs &&
                                    !hasUserCompletedChallenge(assignation) &&  (
                                      <div className="d-flex gap-2 align-self-end me-2">
                                        <div
                                          className={`btn ${userProof ? "btn-info" : "btn-warning"}`}
                                          onClick={() =>
                                            setAssignationToAddProof(
                                              assignation,
                                            )
                                          }
                                        >
                                          {userProof
                                            ? "Editar o veure prova"
                                            : "Enviar prova"}
                                        </div>
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
                                      </div>
                                    )
                                  );
                                })()}

                                {!hasUserCompletedChallenge(assignation) &&
                                  assignation.meta.type === "challenge" &&
                                  assignation.needs_proofs === false && (
                                    <div
                                      className="btn btn-success align-self-end me-2"
                                      onClick={async () => {
                                        const newCompletion =
                                          await createAssignationCompletion(
                                            assignation.id,
                                            loggedInUserId!,
                                            true
                                          );
                                        const score = assignation.score ?? 0;
                                        if (score > 0) {
                                          const user = await fetchUserById(loggedInUserId!);
                                          await updateUser(loggedInUserId!, {
                                            score: user.score + score,
                                          });
                                        }
                                        setAssignations((prev) =>
                                          prev.map((a) =>
                                            a.id === assignation.id
                                              ? {
                                                  ...a,
                                                  assignationCompletions: [
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

                                {showComments === true &&
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
                                      filteredComments.map((comment) => (
                                        <>
                                          <div
                                            key={comment.id}
                                            className="border rounded p-2 mb-1 bg-white me-2"
                                          >
                                            {comment.user?.name ??
                                              comment.user_id}
                                            :
                                            <p className="mb-0">
                                              {comment.body}
                                            </p>
                                            <small>
                                              {new Date(
                                                comment.created_at,
                                              ).toLocaleString("ca-ES")}
                                              {comment.created_at !==
                                                comment.updated_at && (
                                                <>
                                                  {" "}
                                                  (editat:{" "}
                                                  {new Date(
                                                    comment.updated_at,
                                                  ).toLocaleString("ca-ES")}
                                                  )
                                                </>
                                              )}
                                            </small>
                                            <div className=" d-flex justify-content-end">
                                              {comment.user_id ===
                                                getUserId() && (
                                                <div
                                                  className="btn btn-warning align-self-end me-2 "
                                                  title="Editar comentari"
                                                  onClick={() => {
                                                    //edit
                                                    setcomment(comment);
                                                    setAssignationToAddComment(
                                                      assignation,
                                                    );
                                                    setcommentFormType("edit");
                                                  }}
                                                >
                                                  <i className="bi bi-pencil"></i>
                                                </div>
                                              )}
                                              {(comment.user_id ===
                                                getUserId() ||
                                                group.owner_id ===
                                                  getUserId()) && (
                                                <div
                                                  className="btn btn-danger align-self-end me-2 "
                                                  title="Eliminar comentari"
                                                  onClick={async () => {
                                                    if (
                                                      !confirm(
                                                        "Estàs segur que el vols eliminar?",
                                                      )
                                                    )
                                                      return;
                                                    await deleteComment(
                                                      comment.id,
                                                    );
                                                    setComments((prev) =>
                                                      prev.filter(
                                                        (c) =>
                                                          c.id !== comment.id,
                                                      ),
                                                    );
                                                  }}
                                                >
                                                  X
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      ))
                                    ) : (
                                      <p className="text-muted">
                                        No hi ha comentaris
                                      </p>
                                    );
                                  })()}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="me-auto ms-3 fw-bold">
                    Metes dels integrants del grup
                  </div>
                  {memberAssignations.length === 0 ? (
                    <p className="text-muted ps-3 py-2">
                      Encara no hi ha assignacions.
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
                                {(group.groupUsers.some(gu => gu.user_id === getUserId() && gu.role === "moderator") || group.owner_id === getUserId()) && (
                                  <>
                                    <div className="d-flex justify-content-end me-2 mb-2 mt-2">
                                      <div
                                        className="btn btn-primary me-2 "
                                        onClick={() => {
                                          setShowComments((prev) => !prev);
                                        }}
                                      >
                                        Mostrar comentaris
                                      </div>
                                      <div
                                        className="btn btn-primary align-self-end me-2 "
                                        onClick={() => {
                                          setAssignationToAddComment(assignation);
                                          setcommentFormType("create");
                                        }}
                                      >
                                        Nou comentari
                                      </div>
                                    </div>
                                    {showComments === true &&
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
                                          filteredComments.map((comment) => (
                                            <>
                                              <div
                                                key={comment.id}
                                                className="border rounded p-2 mb-1 bg-white me-2"
                                              >
                                                {comment.user?.name ??
                                                  comment.user_id}
                                                :
                                                <p className="mb-0">
                                                  {comment.body}
                                                </p>
                                                <small>
                                                  {new Date(
                                                    comment.created_at,
                                                  ).toLocaleString("ca-ES")}
                                                  {comment.created_at !==
                                                    comment.updated_at && (
                                                    <>
                                                      {" "}
                                                      (editat:{" "}
                                                      {new Date(
                                                        comment.updated_at,
                                                      ).toLocaleString("ca-ES")}
                                                      )
                                                    </>
                                                  )}
                                                </small>
                                                <div className=" d-flex justify-content-end">
                                                  {comment.user_id ===
                                                    getUserId() && (
                                                    <div
                                                      className="btn btn-warning align-self-end me-2 "
                                                      title="Editar comentari"
                                                      onClick={() => {
                                                        setcomment(comment);
                                                        setAssignationToAddComment(
                                                          assignation,
                                                        );
                                                        setcommentFormType("edit");
                                                      }}
                                                    >
                                                      <i className="bi bi-pencil"></i>
                                                    </div>
                                                  )}
                                                  {(comment.user_id ===
                                                    getUserId() ||
                                                    group.owner_id ===
                                                      getUserId()) && (
                                                    <div
                                                      className="btn btn-danger align-self-end me-2 "
                                                      title="Eliminar comentari"
                                                      onClick={async () => {
                                                        if (
                                                          !confirm(
                                                            "Estàs segur que el vols eliminar?",
                                                          )
                                                        )
                                                          return;
                                                        await deleteComment(
                                                          comment.id,
                                                        );
                                                        setComments((prev) =>
                                                          prev.filter(
                                                            (c) =>
                                                              c.id !== comment.id,
                                                          ),
                                                        );
                                                      }}
                                                    >
                                                      X
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </>
                                          ))
                                        ) : (
                                          <p className="text-muted">
                                            No hi ha comentaris
                                          </p>
                                        );
                                      })()}
                                  </>
                                )}
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