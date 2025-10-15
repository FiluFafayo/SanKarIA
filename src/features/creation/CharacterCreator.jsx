// src/features/creation/CharacterCreator.jsx

import { useState } from 'react';

function CharacterCreator() {
  const [characterName, setCharacterName] = useState('');

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="characterName" className="block mb-2 text-sm font-medium text-gray-300">
          Nama Pahlawanmu:
        </label>
        <input
          type="text"
          id="characterName"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Ketik nama di sini..."
        />
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Lanjut: Atribut
        </button>
      </div>
    </div>
  );
}

export default CharacterCreator;