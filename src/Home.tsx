import { useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL, CharacterListResponse } from "./utils";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const updateDebounced = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value);
        setSearchParams(value ? { q: value } : {});
      }, 1000),
    []
  );
  useEffect(() => updateDebounced(query), [query]);

  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, isPreviousData, isFetching, error } =
    useQuery<CharacterListResponse, AxiosError>(
      ["characters", debouncedQuery, page],
      async () =>
        (
          await axios.get(`${API_URL}/character`, {
            params: { page, name: debouncedQuery },
          })
        ).data,
      {
        keepPreviousData: true,
        onSuccess(data) {
          data.results.forEach((character) => {
            queryClient.setQueryData(["character", character.id], character);
          });
        },
      }
    );

  const inputRef = useRef<null | HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        <input
          ref={inputRef}
          className="text-gray-900"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          error.response?.status === 404 ? (
            <div>0 results</div>
          ) : (
            <div>Oops</div>
          )
        ) : data ? (
          <>
            {data.results.map((char) => {
              return (
                <Link
                  key={char.id}
                  to={`c/${char.id}`}
                  state={{ fromSearch: true }}
                >
                  {char.name}
                </Link>
              );
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

export default Home;
