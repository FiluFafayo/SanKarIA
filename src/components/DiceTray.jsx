// src/components/DiceTray.jsx
import { useState } from 'react';
import Dice from 'react-dice-complete';
import 'react-dice-complete/dist/react-dice-complete.css';

function DiceTray() {
  const [diceApi, setDiceApi] = useState(null);

  // Fungsi untuk melempar dadu (contoh d20)
  const rollD20 = () => {
    if (diceApi) {
      diceApi.rollAll([20]); // Melempar satu dadu 20 sisi
    }
  };

  const handleRollComplete = (values) => {
    console.log('Hasil lemparan dadu:', values[0]);
    // Di sini kita bisa meneruskan hasilnya ke state game nanti
  };

  return (
    <div className="p-4 bg-black bg-opacity-50 rounded-lg">
      <h3 className="text-center font-cinzel text-xl mb-4 text-yellow-400">Baki Takdir</h3>
      <Dice
        numDice={1}
        rollDone={handleRollComplete}
        ref={(dice) => setDiceApi(dice)}
        faceColor="#1a1a1a"
        dotColor="#fbbd23"
        outline={true}
        outlineColor="#f6d860"
        dieSize={80}
      />
      <button className="btn btn-warning w-full mt-4" onClick={rollD20}>
        Lempar Uji Coba (d20)
      </button>
    </div>
  );
}

export default DiceTray;