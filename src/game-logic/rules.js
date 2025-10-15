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

// Kita akan menambahkan lebih banyak aturan di sini nanti,
// seperti logika untuk skill checks, saving throws, advantage, dll.