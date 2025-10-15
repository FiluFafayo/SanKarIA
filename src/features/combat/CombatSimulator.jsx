// src/features/combat/CombatSimulator.jsx

import { useState } from 'react';
import { resolveAttack } from '../../game-logic/rules';

function CombatSimulator() {
  const [targetAc, setTargetAc] = useState(12);
  const [attackResult, setAttackResult] = useState(null);

  // Kita asumsikan karakter kita punya +3 STR mod dan +2 proficiency
  const playerStrMod = 3;
  const playerProficiency = 2;

  const handleAttack = () => {
    const result = resolveAttack(playerStrMod, playerProficiency, targetAc);
    setAttackResult(result);
  };

  return (
    <div className="text-left">
      <p className="text-gray-400 mb-4">Uji coba mekanika serangan di sini.</p>

      <div className="mb-4">
        <label htmlFor="targetAc" className="block mb-2 text-sm font-medium text-gray-300">
          Set AC Target:
        </label>
        <input
          type="number"
          id="targetAc"
          value={targetAc}
          onChange={(e) => setTargetAc(parseInt(e.target.value, 10))}
          className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg w-full p-2.5"
        />
      </div>

      <button onClick={handleAttack} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors mb-4">
        SERANG!
      </button>

      {attackResult && (
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className={`text-2xl font-bold text-center mb-2 ${
            attackResult.outcome.includes('HIT') ? 'text-green-400' : 'text-red-400'
          }`}>
            {attackResult.outcome}
          </h3>
          <p className="text-sm text-gray-300 text-center">{attackResult.description}</p>
        </div>
      )}
    </div>
  );
}

export default CombatSimulator;