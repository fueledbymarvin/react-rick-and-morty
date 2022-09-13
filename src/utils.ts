export const API_URL = "https://rickandmortyapi.com/api";

export interface CharacterResponse {
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

export interface CharacterListResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: CharacterResponse[];
}

export interface CharacterLocationState {
  fromSearch: boolean;
}
