// src/features/creation/CharacterCreator.jsx (Versi Upgrade)

import { useState } from 'react';
import DiceBlock from './DiceBlock';

function CharacterCreator() {
  const [characterName, setCharacterName] = useState('');
  const [step, setStep] = useState(1); // Mengelola langkah wizard

  // Daftar Atribut
  const attributes = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];

  return (
    <div>
      {step === 1 && (
        // Langkah 1: Nama Karakter
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
            <button 
              onClick={() => setStep(2)} 
              disabled={!characterName}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Lanjut: Atribut
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        // Langkah 2: Atribut
        <div>
          <p className="text-gray-400 mb-4 text-sm">Lempar dadu untuk menentukan *ability scores* pahlawanmu. Kamu bisa melempar ulang sesukamu.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {attributes.map(attr => <DiceBlock key={attr} attributeName={attr} />)}
          </div>
          <div className="flex justify-between">
            <button 
              onClick={() => setStep(1)} 
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Kembali
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Lanjut: Ras & Kelas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterCreator;