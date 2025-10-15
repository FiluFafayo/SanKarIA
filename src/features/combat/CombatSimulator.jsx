// src/features/combat/CombatSimulator.jsx (Versi Upgrade dengan Sihir)

import { useState } from 'react';
import { resolveAttack, resolveMagicMissile } from '../../game-logic/rules';

function CombatSimulator() {
  const [targetAc, setTargetAc] = useState(12);
  const [attackResult, setAttackResult] = useState(null);
  const [magicResult, setMagicResult] = useState(null);

  // Asumsi statistik pemain
  const playerStrMod = 3;
  const playerProficiency = 2;

  const handleAttack = () => {
    setMagicResult(null); // Reset hasil sihir
    const result = resolveAttack(playerStrMod, playerProficiency, targetAc);
    setAttackResult(result);
  };

  const handleCastSpell = () => {
    setAttackResult(null); // Reset hasil serangan
    const result = resolveMagicMissile(3); // Tembakkan 3 proyektil
    setMagicResult(result);
  };

  return (
    <div className="text-left">
      {/* Bagian Serangan Fisik */}
      <div className="mb-4">
        <label htmlFor="targetAc" className="block mb-2 text-sm font-medium text-gray-300">Set AC Target:</label>
        <input
          type="number"
          id="targetAc"
          value={targetAc}
          onChange={(e) => setTargetAc(parseInt(e.target.value, 10))}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg w-full p-2.5"
        />
      </div>
      <button onClick={handleAttack} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors mb-2">
        SERANG FISIK!
      </button>

      {/* Tombol Sihir Baru */}
      <button onClick={handleCastSpell} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors mb-4">
        RAPAL MAGIC MISSILE!
      </button>

      {/* Tampilan Hasil */}
      {attackResult && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className={`text-2xl font-bold text-center mb-2 ${attackResult.outcome.includes('HIT') ? 'text-green-400' : 'text-red-400'}`}>
            {attackResult.outcome}
          </h3>
          <p className="text-sm text-gray-300 text-center">{attackResult.description}</p>
        </div>
      )}
      {magicResult && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-center mb-2 text-purple-400">
            {magicResult.spellName}
          </h3>
          <p className="text-sm text-gray-300 text-center">{magicResult.description}</p>
        </div>
      )}
    </div>
  );
}

export default CombatSimulator;