import { useState, useEffect } from "react";

import type { assignationType } from "../../types/assignationType";
import { commentSchema } from "../../schemas/commentSchema";
import { getUserId } from "../../services/auth/loginService";
import { createComment, updateComment } from "../../services/commentService";
import type { commentType } from "../../types/commentType";
import type { categoryType } from "../../types/categoryType";
import type { metaType } from "../../types/metaType";
import { createIndexedMeta } from "../../services/IndexerService";
import { createMeta } from "../../services/metaService";
import { metaSchema } from "../../schemas/metaSchema";
import { indexSchema } from "../../schemas/indexSchema";
import type { groupType } from "../../types/groupType";
import { fetchGroupsByUserId } from "../../services/groupService";
import { createAssignation } from "../../services/assignationService";

type ModalProps = {
  setCreatingMeta: React.Dispatch<React.SetStateAction<boolean>>;
  categories: categoryType[];
  setMetas: React.Dispatch<React.SetStateAction<metaType[]>>;
};

export function ModalUserCreateMeta({
  setCreatingMeta,
  categories,
  setMetas,
}: ModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [needsProofs, setNeedsProofs] = useState<boolean>(false);
  const metaTypeOptions: metaType["type"][] = ["task", "challenge"];
  const [myGroups, setMyGroups] = useState<groupType[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    undefined,
  );
  const [metaType, setMetaType] = useState<"task" | "challenge">("task");
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetchGroupsByUserId(userId).then(setMyGroups);
    }
  }, []);

  useEffect(() => {
    if (isPublic) {
      setErrors((prev) => {
        const { group_id, user_id, ...rest } = prev;
        return rest;
      });
    }
  }, [isPublic]);

  const selectedGroupUsers = selectedGroupId
    ? (myGroups
        .find((g) => g.id === selectedGroupId)
        ?.groupUsers.map((gu) => gu.user) ?? [])
    : [];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const metaData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category_id: formData.get("category_id")
        ? Number(formData.get("category_id"))
        : undefined,
      type: formData.get("type"),
      author_id: getUserId(),
      is_public: formData.get("is_public") !== null,
    };

    const validation = metaSchema.safeParse(metaData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // validacions extres del formulari
    if (!validation.data.is_public) {
      const errorsExtra: Record<string, string> = {};
      if (!selectedGroupId) {
        errorsExtra.group_id = "Has de triar un grup";
      }
      if (validation.data.type === "task" && !selectedUserId) {
        errorsExtra.user_id = "Has de triar un usuari del grup";
      }
      if (Object.keys(errorsExtra).length > 0) {
        setErrors(errorsExtra);
        return;
      }
    }

    if (
      !validation.data.is_public &&
      validation.data.type === "task" &&
      selectedGroupId
    ) {
      const selectedGroup = myGroups.find((g) => g.id === selectedGroupId);
      const currentUserId = getUserId();
      const isModerator = selectedGroup?.groupUsers.some(
        (gu) => gu.user_id === currentUserId && gu.role === "moderator",
      );
      if (!isModerator) {
        setErrors({
          assign_permission:
            "No ets moderador d'aquest grup, no pots assignar una tasca a un usuari",
        });
        return;
      }
    }

    const newMeta = await createMeta(validation.data);

    const indexedMetaData = {
      user_id: getUserId(),
      meta_id: newMeta.id,
    };

    const indexedValidation = indexSchema.safeParse(indexedMetaData);
    if (indexedValidation.success) {
      await createIndexedMeta(indexedValidation.data);
    }

    if (selectedGroupId) {
      await createAssignation({
        meta_id: newMeta.id,
        group_id: selectedGroupId,
        assigner_id: getUserId()!,
        score: formData.get("score")
          ? Number(formData.get("score"))
          : undefined,
        needs_proofs: needsProofs,
        user_id: selectedUserId,
        start_date: (formData.get("start_date") as string) || undefined,
        due_date: (formData.get("due_date") as string) || undefined,
        priority: (formData.get("priority") as string) || undefined,
        difficulty: formData.get("difficulty") as
          | "easy"
          | "normal"
          | "hard"
          | "extreme",
      });
    }
    setMetas((prev) => [...prev, newMeta]);
    alert("Meta creada correctament");
    setCreatingMeta(false);
  }

  return (
    <>
      <div className="modalOverlay h-100 w-100">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-6">
              <div className="modalWindow">
                <h5>Crea una meta</h5>

                <form onSubmit={handleSubmit}>
                  <div className="d-flex flex-column">
                    <label htmlFor="title">Títol</label>
                    <input
                      className="form-control mb-2"
                      type="text"
                      name="title"
                      id="title"
                    />
                  </div>
                  {errors.title && (
                    <small className="text-danger d-block mb-2">
                      {errors.title}
                    </small>
                  )}

                  <div className="d-flex flex-column">
                    <label htmlFor="description">Descripció</label>
                    <textarea
                      className="form-control mb-2"
                      name="description"
                      id="description"
                    />
                  </div>
                  {errors.description && (
                    <small className="text-danger d-block mb-2">
                      {errors.description}
                    </small>
                  )}

                  <div className="d-flex flex-column">
                    <label htmlFor="type">Tipus</label>
                    <select
                      className="form-select mb-2"
                      name="type"
                      id="type"
                      value={metaType}
                      onChange={(e) =>
                        setMetaType(e.target.value as "task" | "challenge")
                      }
                    >
                      {metaTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex flex-column">
                    <label htmlFor="category_id">Categoria</label>
                    <select
                      className="form-select mb-2"
                      name="category_id"
                      id="category_id"
                    >
                      {categories.map((category: any) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="me-5 my-2" htmlFor="is_public">
                      Es publica?
                    </label>
                    <input
                      type="checkbox"
                      name="is_public"
                      id="is_public"
                      checked={isPublic}
                      // onChange={() => setNeedsProofs(prev => !prev)}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                  </div>

                  {isPublic === false && (
                    <>
                      <div>
                        {/* {metaType === "challenge" && */}
                        {metaType === "challenge" && (
                          <div>
                            <label htmlFor="score">Punts al completar:</label>
                            <input
                              className="form-control mb-2"
                              type="number"
                              name="score"
                              id="score"
                            />
                          </div>
                        )}

                        <div>
                          <label htmlFor="start_date">📅 Inici:</label>
                          <input
                            className="form-control mb-2"
                            type="date"
                            name="start_date"
                            id="start_date"
                            defaultValue={
                              new Date().toISOString().split("T")[0]
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor="due_date">⏳ Data límit</label>
                          <input
                            className="form-control mb-2"
                            type="date"
                            name="due_date"
                            id="due_date"
                          />
                        </div>
                        <div>
                          <label htmlFor="priority">🔥 Prioritat:</label>
                          <select
                            className="form-select mb-2"
                            name="priority"
                            id="priority"
                          >
                            <option value={""}>Sense prioritat</option>
                            <option value="high">Alta</option>
                            <option value="low">Baixa</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="difficulty">🎯 Dificultat</label>
                          <select
                            className="form-select mb-2"
                            name="difficulty"
                            id="difficulty"
                            defaultValue="normal"
                          >
                            <option value="easy">Fàcil</option>
                            <option value="normal">Normal</option>
                            <option value="hard">Difícil</option>
                            <option value="extreme">Extrem</option>
                          </select>
                        </div>
                        {/* } */}

                        <label htmlFor="group_id">
                          Grups dels que formes part:
                        </label>
                        <select
                          className="form-select mb-2"
                          name="group_id"
                          id="group_id"
                          onChange={(e) => {
                            setSelectedGroupId(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            );
                            setSelectedUserId(undefined);
                          }}
                        >
                          <option value={""}>Tria un grup</option>
                          {myGroups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                        </select>
                        {errors.group_id && (
                          <div className="text-danger small">
                            {errors.group_id}
                          </div>
                        )}
                      </div>

                      {metaType === "task" && (
                        <div>
                          <label htmlFor="user_id">Usuaris del grup:</label>
                          <select
                            className="form-select mb-2"
                            name="user_id"
                            id="user_id"
                            value={selectedUserId ?? ""}
                            onChange={(e) =>
                              setSelectedUserId(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                          >
                            <option value={""}>Tria un usuari del grup</option>
                            {selectedGroupUsers.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.name}
                              </option>
                            ))}
                          </select>
                          {errors.user_id && (
                            <div className="text-danger small">
                              {errors.user_id}
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <label className="me-5 my-2" htmlFor="needs_proofs">
                          Proves necessaries?
                        </label>
                        <input
                          type="checkbox"
                          name="needs_proofs"
                          id="needs_proofs"
                          onChange={() => setNeedsProofs((prev) => !prev)}
                        />
                      </div>

                      <div>
                        {errors.assign_permission && (
                          <small className="text-danger d-block mb-2">
                            {errors.assign_permission}
                          </small>
                        )}
                      </div>
                    </>
                  )}

                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => setCreatingMeta(false)}
                    >
                      Cancela
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Crea la meta
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
