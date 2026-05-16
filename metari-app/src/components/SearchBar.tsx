import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const word = searchParams.get("q") ?? "";
  const [formData, setFormData] = useState<any>({
    word,
  });

  const navigate = useNavigate();

  const submitSearch = (data: any) => {
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
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
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
      </form>
    </>
  );
}
