import { useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL, CharacterListResponse } from "./utils";
import CharacterCard from "./CharacterCard";
import Button from "./Button";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const updateDebounced = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedQuery(value);
        setSearchParams(value ? { q: value } : {});
      }, 100),
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
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="max-w-lg flex flex-col w-full p-6">
        <h1 className="text-4xl">Character Explorer</h1>
        <input
          ref={inputRef}
          className="px-2 py-1 rounded-lg mt-6 mb-2 border border-gray-500"
          placeholder="Search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {isLoading ? (
          <div className="text-center text-gray-500 text-sm">Loading...</div>
        ) : isError ? (
          error.response?.status === 404 ? (
            <div className="text-center text-gray-500 text-sm">0 results</div>
          ) : (
            <div className="text-center text-gray-500 text-sm">Oops</div>
          )
        ) : data ? (
          <>
            {isFetching ? (
              <div className="text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                {data.info.count} result{data.info.count === 1 || "s"}
              </div>
            )}
            {data.results.map((char) => {
              return (
                <Link
                  className="mt-4"
                  key={char.id}
                  to={`/c/${char.id}`}
                  state={{ fromSearch: true }}
                >
                  <CharacterCard character={char} />
                </Link>
              );
            })}
            <div className="flex justify-between mt-8">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={isPreviousData || !data.info.prev}
              >
                Previous
              </Button>
              <Button
                onClick={() => setPage((p) => p + 1)}
                disabled={isPreviousData || !data.info.next}
              >
                Next
              </Button>
            </div>
            <div className="text-center text-gray-500 text-sm mt-2">
              Page {page} of {data.info.pages}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Home;
