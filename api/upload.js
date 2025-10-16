// api/upload.js (Versi Perbaikan untuk Node.js Runtime)

import { put } from '@vercel/blob';

// TIDAK ADA LAGI 'export const config'

export default async function handler(req, res) {
  // 1. Ganti 'request' menjadi 'req' dan 'res'
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // 2. Baca filename dari 'req.query' bukan 'searchParams'
  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  try {
    // 3. 'req.body' di Node.js runtime sudah berisi data file mentah
    const blob = await put(filename, req.body, {
      access: 'public',
    });

    // 4. Kirim respons menggunakan 'res.status().json()'
    return res.status(200).json(blob);

  } catch (error) {
    console.error("Error di fungsi upload:", error);
    return res.status(500).json({ message: 'Gagal mengunggah file', error: error.message });
  }
}