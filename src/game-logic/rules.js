// src/game-logic/rules.js

/**
 * Menghitung ability score modifier dari sebuah ability score.
 * Aturannya: (score - 10) / 2, dibulatkan ke bawah.
 * Contoh: score 16 -> modifier +3. score 9 -> modifier -1.
 * @param {number} score - Nilai ability score (misal: 16, 9, 20).
 * @returns {number} - Nilai modifier yang sesuai.
 */
export const getModifier = (score) => {
  return Math.floor((score - 10) / 2);
};

/**
 * Menghitung proficiency bonus berdasarkan level karakter.
 * Aturannya: +2 untuk level 1-4, +3 untuk 5-8, dst.
 * @param {number} level - Level karakter.
 * @returns {number} - Nilai proficiency bonus.
 */
export const getProficiencyBonus = (level) => {
  if (level < 1) return 0;
  return Math.floor((level - 1) / 4) + 2;
};

/**
 * Menghitung HP dasar karakter level 1.
 * Aturannya: Hit Dice maksimum dari kelas + Constitution Modifier.
 * Untuk saat ini, kita anggap rata-rata Hit Dice adalah 8 (seperti Fighter/Cleric).
 * @param {number} conModifier - Constitution modifier dari karakter.
 * @returns {number} - Total HP maksimum di level 1.
 */
export const calculateBaseHp = (conModifier) => {
  const baseHitDice = 8; // Kita asumsikan 8 untuk sekarang
  return baseHitDice + conModifier;
};

/**
 * Menghitung Armor Class (AC) dasar tanpa zirah.
 * Aturannya: 10 + Dexterity Modifier.
 * @param {number} dexModifier - Dexterity modifier dari karakter.
 * @returns {number} - Nilai Armor Class dasar.
 */
export const calculateBaseAc = (dexModifier) => {
  return 10 + dexModifier;
};

/**
 * Menyelesaikan sebuah aksi serangan, dari lemparan dadu hingga hasil.
 * @param {number} attackerStrModifier - Strength modifier si penyerang.
 * @param {number} attackerProficiency - Proficiency bonus si penyerang.
 * @param {number} targetAc - Armor Class si target.
 * @returns {object} - Sebuah objek yang merinci seluruh proses serangan.
 */
export const resolveAttack = (attackerStrModifier, attackerProficiency, targetAc) => {
  // 1. Lempar dadu d20
  const d20Roll = Math.floor(Math.random() * 20) + 1;

  // 2. Hitung total bonus serangan
  const attackBonus = attackerStrModifier + attackerProficiency;

  // 3. Hitung total hasil lemparan serangan
  const totalAttackRoll = d20Roll + attackBonus;

  // 4. Tentukan hasilnya
  let outcome = '';
  let isCriticalHit = false;

  if (d20Roll === 20) {
    outcome = 'CRITICAL HIT!';
    isCriticalHit = true;
  } else if (d20Roll === 1) {
    outcome = 'CRITICAL MISS!';
  } else if (totalAttackRoll >= targetAc) {
    outcome = 'HIT!';
  } else {
    outcome = 'MISS!';
  }

  // 5. Kembalikan laporan lengkap
  return {
    d20Roll,
    attackBonus,
    totalAttackRoll,
    targetAc,
    outcome,
    isCriticalHit,
    description: `Lemparan d20 (${d20Roll}) + Bonus Serangan (${attackBonus}) = ${totalAttackRoll} vs. AC Target (${targetAc}). Hasil: ${outcome}`
  };
};

// Kita akan menambahkan lebih banyak aturan di sini nanti,
// seperti logika untuk skill checks, saving throws, advantage, dll.