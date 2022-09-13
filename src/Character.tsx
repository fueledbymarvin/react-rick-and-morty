import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, CharacterResponse } from "./utils";

function Character() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery(
    ["character", id],
    async () =>
      (await axios.get<CharacterResponse>(`${API_URL}/character/${id}`)).data
  );

  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        <button onClick={() => navigate(-1)}>Return to search</button>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Oops</div>
        ) : data ? (
          <div>{data.name}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Character;
