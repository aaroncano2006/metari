import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { searchSchema } from "../schemas/searchSchema";

export default function SearchBar() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const word = searchParams.get("q") ?? "";
  const [formData, setFormData] = useState<any>({
    word,
  });

  const navigate = useNavigate();

  const submitSearch = (data: any) => {
    const validation = searchSchema.safeParse(data);
    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });

      return setErrors(errors);
    }
    setErrors({});

    navigate(`/search?q=${data.word}`);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch(formData);
        }}
      >
        <div className="input-group">
          <button className="input-group-text" type="submit">
            <i className="bi bi-search"></i>
          </button>
          <input
            type="text"
            id="word"
            name="word"
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            className="form-control"
            placeholder="Cerca"
          />
        </div>
        {errors.word && (
            <small className="text-danger d-flex mb-2 mt-1">{errors.word}</small>
          )}
      </form>
    </>
  );
}
