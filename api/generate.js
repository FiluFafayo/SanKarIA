// api/generate.js

import makeResilientRequest from './_utils/resilient-requester.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Susun payload sesuai format yang dibutuhkan API v1beta
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      // Tambahkan safety settings untuk meminimalisir pemblokiran konten
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    };

    const result = await makeResilientRequest(payload);

    // Ekstrak teks dari struktur respons yang baru
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('AI response is empty or has an unexpected structure.');
    }

    res.status(200).json({ text });

  } catch (error) {
    console.error("Error di handler generate.js:", error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
}