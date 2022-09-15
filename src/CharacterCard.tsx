import { CharacterResponse } from "./utils";

function CharacterCard({ character }: { character: CharacterResponse }) {
  return (
    <div className="rounded-lg shadow flex overflow-hidden">
      <img src={character.image} className="w-20 h-20" />
      <div className="px-4 py-2 min-w-0">
        <div className="text-xl font-bold truncate">{character.name}</div>
        <div className="text-gray-500 mt-2 truncate">
          {character.location.name}
        </div>
      </div>
    </div>
  );
}

export default CharacterCard;
