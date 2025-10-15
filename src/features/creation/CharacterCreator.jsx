// src/features/creation/CharacterCreator.jsx (Versi Final dengan Firestore)

import { useState } from 'react';
import DiceBlock from './DiceBlock';
import { auth, db } from '../../firebase'; // <-- 1. Impor koneksi Auth dan Database
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // <-- 2. Impor fungsi-fungsi Firestore

function CharacterCreator({ closeModal }) { // <-- Prop baru untuk menutup modal
  const [characterName, setCharacterName] = useState('');
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false); // State untuk loading

  // State untuk menyimpan semua skor dan detail lemparan
  const [attributes, setAttributes] = useState({
    Strength: { score: 10, rolls: null },
    Dexterity: { score: 10, rolls: null },
    Constitution: { score: 10, rolls: null },
    Intelligence: { score: 10, rolls: null },
    Wisdom: { score: 10, rolls: null },
    Charisma: { score: 10, rolls: null },
  });

  // 3. Logika lemparan dadu sekarang ada di sini!
  const handleRoll = (attributeName) => {
    const currentRolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    currentRolls.sort((a, b) => a - b);
    const rollsToSum = currentRolls.slice(1);
    const sum = rollsToSum.reduce((total, roll) => total + roll, 0);

    setAttributes(prev => ({
      ...prev,
      [attributeName]: { score: sum, rolls: currentRolls }
    }));
  };

  // 4. FUNGSI SAKRAL: Menyimpan karakter ke Firestore
  const handleSaveCharacter = async () => {
    if (!auth.currentUser) {
      alert("Kamu harus login untuk menyimpan karakter!");
      return;
    }
    setIsSaving(true);

    // Siapkan data yang akan dikirim
    const characterData = {
      name: characterName,
      level: 1,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      attributes: {
        strength: attributes.Strength.score,
        dexterity: attributes.Dexterity.score,
        constitution: attributes.Constitution.score,
        intelligence: attributes.Intelligence.score,
        wisdom: attributes.Wisdom.score,
        charisma: attributes.Charisma.score,
      },
      // Kita akan tambahkan Ras, Kelas, HP, dll di sini nanti
    };

    try {
      const docRef = await addDoc(collection(db, "characters"), characterData);
      console.log("Karakter disimpan dengan ID: ", docRef.id);
      alert(`Pahlawan "${characterName}" berhasil diciptakan!`);
      closeModal(); // Tutup modal setelah berhasil
    } catch (e) {
      console.error("Error menambahkan dokumen: ", e);
      alert("Gagal menciptakan pahlawan. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {step === 1 && (
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
        <div>
          <p className="text-gray-400 mb-4 text-sm">Lempar dadu untuk menentukan *ability scores*.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.keys(attributes).map(attr => (
              <DiceBlock 
                key={attr} 
                attributeName={attr}
                score={attributes[attr].score}
                rollDetails={attributes[attr].rolls}
                onRoll={() => handleRoll(attr)}
              />
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Kembali
            </button>
            <button 
              onClick={handleSaveCharacter} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Karakter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterCreator;