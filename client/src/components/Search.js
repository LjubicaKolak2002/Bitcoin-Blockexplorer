import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search) return;

    if (/^0000/.test(search)){
      navigate(`/blockDetails/${search}`);
    } else if  (/^[0-9a-fA-F]{64}$/.test(search)) {
      navigate(`/transactionDetails/${search}`);
    } else if (!isNaN(parseInt(search))) {
      navigate(`/blockByHeight/${search}`);
    } else {
      alert("Unos nije valjan. Molimo unesite ispravan block hash, block height ili transaction ID.");
    }
  };

  return (
    <form onSubmit={handleSearch} className="example">
      <div className="input-container">
        <input
          type="text"
          value={search}
          className="form-control"
          placeholder="Search by block hash, height, or txid"
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search input-icon"
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </div>
    </form>
  );
};

export default Search;
