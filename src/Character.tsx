import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { API_URL, CharacterLocationState, CharacterResponse } from "./utils";
import NotFound from "./NotFound";

function Character() {
  const { id: idString } = useParams();
  const id = parseInt(idString || "");
  const { data, isLoading, isError, error } = useQuery<
    CharacterResponse,
    AxiosError
  >(
    ["character", id],
    async () => (await axios.get(`${API_URL}/character/${id}`)).data,
    { enabled: !isNaN(id) }
  );

  const location = useLocation();
  const navigate = useNavigate();

  return isNaN(id) || (isError && error.response?.status === 404) ? (
    <NotFound />
  ) : (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        {(location.state as CharacterLocationState | null)?.fromSearch && (
          <button onClick={() => navigate(-1)}>Return to search</button>
        )}
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
