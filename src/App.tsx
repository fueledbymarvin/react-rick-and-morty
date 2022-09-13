import schwifty from "./assets/schwifty.png";
import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";

const API_URL = "https://rickandmortyapi.com/api";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
}

interface CharacterListResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

function App() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isPreviousData, isFetching } = useQuery(
    ["characters", page],
    async () =>
      (
        await axios.get<CharacterListResponse>(`${API_URL}/character`, {
          params: { page },
        })
      ).data,
    { keepPreviousData: true }
  );

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Oops</div>
        ) : data ? (
          <>
            {data.results.map((char) => {
              return <div>{char.name}</div>;
            })}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={isPreviousData || !data.info.prev}
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={isPreviousData || !data.info.next}
            >
              Next
            </button>
            {isFetching && <div>Loading...</div>}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
