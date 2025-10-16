// src/features/character/CharacterSheet.jsx

import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getModifier, getProficiencyBonus, resolveAttack } from '../../game-logic/rules';

function CharacterSheet({ characterId }) {
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attackResult, setAttackResult] = useState(null);
  const [targetAc, setTargetAc] = useState(10);

  // 1. Ambil data karakter dari Firestore saat komponen dimuat
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const docRef = doc(db, "characters", characterId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCharacter({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Karakter tidak ditemukan!");
        }
      } catch (err) {
        setError("Gagal memuat karakter.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  // 2. Fungsi untuk menangani serangan MENGGUNAKAN stats karakter
  const handleAttack = () => {
    if (!character) return;

    const strModifier = getModifier(character.attributes.strength);
    const proficiency = getProficiencyBonus(character.level);

    const result = resolveAttack(strModifier, proficiency, targetAc);
    setAttackResult(result);
  };

  if (loading) return <p>Memuat data pahlawan...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!character) return null;

  // 3. Tampilkan data dan panel aksi
  return (
    <div className="text-left space-y-6">
      <header className="border-b-2 border-gray-600 pb-4">
        <h2 className="text-4xl font-bold">{character.name}</h2>
        <p className="text-gray-400">Level {character.level} {character.class} {character.race}</p>
      </header>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700 p-3 rounded">
          <span className="text-xs text-gray-400">HP</span>
          <p className="text-2xl font-bold">{character.hp.current} / {character.hp.max}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <span className="text-xs text-gray-400">AC</span>
          <p className="text-2xl font-bold">{character.ac}</p>
        </div>
         <div className="bg-gray-700 p-3 rounded">
          <span className="text-xs text-gray-400">Proficiency</span>
          <p className="text-2xl font-bold">+{getProficiencyBonus(character.level)}</p>
        </div>
      </div>

      {/* Panel Aksi Tempur */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Aksi Tempur</h3>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="targetAcSheet" className="text-sm">AC Target:</label>
          <input type="number" id="targetAcSheet" value={targetAc} onChange={(e) => setTargetAc(parseInt(e.target.value, 10))} className="bg-gray-700 rounded p-1 w-16" />
          <button onClick={handleAttack} className="flex-grow bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition-colors">
            Serang dengan Pedang!
          </button>
        </div>
        {attackResult && (
          <div className="mt-2 text-center bg-black bg-opacity-30 p-2 rounded">
            <p className={`font-bold ${attackResult.outcome.includes('HIT') ? 'text-green-400' : 'text-red-400'}`}>{attackResult.outcome}</p>
            <p className="text-xs text-gray-400">{attackResult.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharacterSheet;