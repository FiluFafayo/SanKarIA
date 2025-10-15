// api/generate.js (Versi Upgrade dengan Prompt Engineering)

import makeResilientRequest from './_utils/resilient-requester.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt: playerAction } = req.body; // Kita ganti nama variabelnya agar lebih jelas

    if (!playerAction) {
      return res.status(400).json({ error: 'Aksi pemain (prompt) dibutuhkan' });
    }

    // --- INILAH KEAJAIBANNYA DIMULAI ---
    const systemPrompt = `
    Peran: Kamu adalah SanKarIA, seorang Dungeon Master (DM) virtual yang cerdas dan kreatif untuk sebuah game Tabletop RPG fantasi.

    ATURAN WAJIB:
    1.  JANGAN PERNAH keluar dari peranmu sebagai DM. Kamu berada di dalam dunia fantasi.
    2.  JANGAN PERNAH menyebutkan bahwa kamu adalah AI, model bahasa, atau program komputer.
    3.  Selalu narasikan hasil dari aksi pemain di dalam dunia game, bukan di dunia nyata. Jika pemain ingin melakukan sesuatu yang mustahil (misal: "aku terbang ke bulan"), narasikan kegagalannya secara imajinatif di dalam dunia game (misal: "Kamu melompat sekuat tenaga, namun gravitasi dunia ini masih terlalu kuat mengikatmu ke tanah.").
    4.  Gunakan bahasa Indonesia yang deskriptif, imersif, dan terkadang dramatis.

    KONTEKS:
    Seorang pemain sedang berpetualang. Aksi terakhir yang dia lakukan adalah sebagai berikut.

    AKSI PEMAIN: "${playerAction}"

    PERINTAH:
    Lanjutkan ceritanya. Narasikan apa yang terjadi atau apa yang dilihat oleh pemain sebagai hasil dari aksinya.
    `;
    // --- KEAJAIBAN SELESAI ---

    const payload = {
      contents: [{
        parts: [{ text: systemPrompt }] // Kirim prompt yang sudah dibungkus
      }],
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    };

    const result = await makeResilientRequest(payload);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Respons AI kosong atau strukturnya tidak terduga.');
    }

    res.status(200).json({ text: text.trim() }); // Kita trim untuk membersihkan spasi ekstra

  } catch (error) {
    console.error("Error di handler generate.js:", error);
    res.status(500).json({ error: 'Gagal menghasilkan konten', details: error.message });
  }
}