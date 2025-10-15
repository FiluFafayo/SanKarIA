// src/features/creation/CharacterCreator.jsx (Versi Final dengan Firestore)

import { useState } from 'react';
import DiceBlock from './DiceBlock';
import { auth, db } from '../../firebase'; // <-- 1. Impor koneksi Auth dan Database
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // <-- 2. Impor fungsi-fungsi Firestore
import { getModifier, calculateBaseHp, calculateBaseAc } from '../../game-logic/rules';

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

    // ---MULAI PERUBAHAN---

    // 1. Ambil skor yang relevan
    const constitutionScore = attributes.Constitution.score;
    const dexterityScore = attributes.Dexterity.score;

    // 2. Hitung modifier menggunakan Rules Engine
    const conModifier = getModifier(constitutionScore);
    const dexModifier = getModifier(dexterityScore);

    // 3. Hitung HP dan AC menggunakan Rules Engine
    const maxHp = calculateBaseHp(conModifier);
    const armorClass = calculateBaseAc(dexModifier);

    // 4. Siapkan data yang lebih lengkap
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

        // Statistik tempur yang baru ditambahkan
        hp: {
        current: maxHp,
        max: maxHp,
        },
        ac: armorClass,

        // Placeholder untuk masa depan
        race: "Human", // default
        class: "Fighter", // default
    };

    // ---AKHIR PERUBAHAN---

    try {
        const docRef = await addDoc(collection(db, "characters"), characterData);
        console.log("Karakter siap tempur disimpan dengan ID: ", docRef.id);
        alert(`Pahlawan "${characterName}" berhasil ditempa!`);
        closeModal();
    } catch (e) {
        console.error("Error menambahkan dokumen: ", e);
        alert("Gagal menempa pahlawan. Coba lagi.");
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