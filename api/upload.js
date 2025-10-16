// api/upload.js (Versi Final untuk Node.js Runtime)

import { put } from '@vercel/blob';

// 1. Tambahkan konfigurasi ini untuk MENONAKTIFKAN body parser Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const filename = req.query.filename;

  if (!filename) {
    return res.status(400).json({ message: 'Filename is required' });
  }

  try {
    // 2. Ganti 'req.body' menjadi 'req'.
    // Ini memberikan seluruh 'paket' mentah ke Vercel Blob.
    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json(blob);

  } catch (error) {
    console.error("Error di fungsi upload:", error);
    return res.status(500).json({ message: 'Gagal mengunggah file', error: error.message });
  }
}