// src/features/creation/DiceBlock.jsx

import { useState } from 'react';
import { getModifier } from '../../game-logic/rules'; // Impor mesin aturan kita!

function DiceBlock({ attributeName }) {
  const [rolls, setRolls] = useState([]);
  const [finalScore, setFinalScore] = useState(10);

  const rollAttribute = () => {
    // Simulasi lempar 4 dadu d6
    const currentRolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);

    // Urutkan dari terkecil ke terbesar
    currentRolls.sort((a, b) => a - b);

    // Buang yang terkecil (elemen pertama setelah diurutkan)
    const rollsToSum = currentRolls.slice(1);

    // Jumlahkan 3 dadu sisanya
    const sum = rollsToSum.reduce((total, roll) => total + roll, 0);

    setRolls(currentRolls);
    setFinalScore(sum);
  };

  const modifier = getModifier(finalScore);

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">{attributeName}</h3>
        <div className="text-xs text-gray-400 mt-1">
          {rolls.length > 0 ? (
            <span>
              Lemparan: <span className="text-red-500 line-through">{rolls[0]}</span>, {rolls.slice(1).join(', ')}
            </span>
          ) : (
            <span>Belum dilempar</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold">{finalScore}</div>
        <div className={`text-sm font-semibold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {modifier >= 0 ? `+${modifier}` : modifier}
        </div>
      </div>
      <button 
        onClick={rollAttribute} 
        className="ml-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded transition-colors"
        title="Lempar 4d6, buang terendah"
      >
        🎲
      </button>
    </div>
  );
}

export default DiceBlock;