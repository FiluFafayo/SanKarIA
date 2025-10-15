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

// Kita akan menambahkan lebih banyak aturan di sini nanti,
// seperti logika untuk skill checks, saving throws, advantage, dll.