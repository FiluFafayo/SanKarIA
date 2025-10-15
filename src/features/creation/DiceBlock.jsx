// src/features/creation/DiceBlock.jsx (Versi Refaktor)

import { getModifier } from '../../game-logic/rules';

function DiceBlock({ attributeName, score, onRoll, rollDetails }) {
  const modifier = getModifier(score);

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-between">
      <div>
        <h3 className="font-bold text-lg">{attributeName}</h3>
        <div className="text-xs text-gray-400 mt-1">
          {rollDetails ? (
            <span>
              Lemparan: <span className="text-red-500 line-through">{rollDetails[0]}</span>, {rollDetails.slice(1).join(', ')}
            </span>
          ) : (
            <span>Siap dilempar</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold">{score}</div>
        <div className={`text-sm font-semibold ${modifier >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {modifier >= 0 ? `+${modifier}` : modifier}
        </div>
      </div>
      <button 
        onClick={onRoll} 
        className="ml-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-3 rounded transition-colors"
        title={`Lempar untuk ${attributeName}`}
      >
        🎲
      </button>
    </div>
  );
}

export default DiceBlock;