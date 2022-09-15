import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  API_URL,
  CharacterLocationState,
  CharacterResponse,
  LocationResponse,
} from "./utils";
import NotFound from "./NotFound";
import Button from "./Button";
import last from "lodash/last";
import take from "lodash/take";
import CharacterCard from "./CharacterCard";

const getIdFromUrl = (url: string): number => {
  return parseInt(last(new URL(url).pathname.split("/")) || "");
};

function Character() {
  const { id: idString } = useParams();
  const id = parseInt(idString || "");
  const charQuery = useQuery<CharacterResponse, AxiosError>(
    ["character", id],
    async () => (await axios.get(`${API_URL}/character/${id}`)).data,
    { enabled: !isNaN(id) }
  );
  const character = charQuery.data;
  const locId = character ? getIdFromUrl(character.location.url) : null;

  const locQuery = useQuery<LocationResponse, AxiosError>(
    ["location", locId],
    async () => (await axios.get(`${API_URL}/location/${locId}`)).data,
    { enabled: !!locId && !isNaN(locId) }
  );

  const nearIds = take(
    locQuery.data?.residents
      .map(getIdFromUrl)
      .filter((nearId) => !isNaN(nearId) && nearId !== id),
    5
  );
  const nearIdsString = nearIds.join(",");

  const nearQuery = useQuery<CharacterResponse[], AxiosError>(
    ["character", nearIdsString],
    async () => (await axios.get(`${API_URL}/character/${nearIdsString}`)).data,
    { enabled: nearIds.length > 0 }
  );
  const near = nearQuery.data;

  const isLoading =
    charQuery.isLoading || locQuery.isLoading || nearQuery.isLoading;
  const isError = charQuery.isError || locQuery.isError || nearQuery.isError;
  const error = charQuery.error || locQuery.error || nearQuery.error;

  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as CharacterLocationState | null;

  return isNaN(id) || (isError && error?.response?.status === 404) ? (
    <NotFound />
  ) : (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="max-w-lg flex flex-col w-full p-6">
        {(locationState?.fromSearch || locationState?.fromChar) && (
          <Button className="self-start mb-6" onClick={() => navigate(-1)}>
            Return to {locationState?.fromSearch ? "search" : "previous"}
          </Button>
        )}
        {isLoading ? (
          <div className="text-center text-gray-500 text-sm">Loading...</div>
        ) : isError ? (
          <div className="text-center text-gray-500 text-sm">Oops</div>
        ) : character && near ? (
          <>
            <div className="flex flex-col overflow-hidden rounded-lg shadow">
              <img
                src={character.image}
                alt={character.name}
                className="w-full"
              />
              <div className="space-y-4 p-4">
                <h1 className="font-bold text-2xl">{character.name}</h1>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div>{character.location.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Species</div>
                  <div>{character.species}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Gender</div>
                  <div>{character.gender}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Living Status
                  </div>
                  <div>{character.status}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">
                    Episodes Seen In
                  </div>
                  <div>{character.episode.length}</div>
                </div>
              </div>
            </div>
            <div className="text-2xl mt-6">Near</div>
            {near.map((char) => {
              return (
                <Link
                  className="mt-4"
                  key={char.id}
                  to={`/c/${char.id}`}
                  state={{ fromChar: true }}
                >
                  <CharacterCard character={char} />
                </Link>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Character;
