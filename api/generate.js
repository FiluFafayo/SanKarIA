// api/generate.js (Versi Upgrade v1beta)

import { GoogleGenerativeAI } from "@google/generative-ai";

// Kita paksa SDK untuk menggunakan endpoint v1beta
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { 
  apiClient: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta' } 
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // --- DAN PERUBAHAN DI SINI ---
    // Menggunakan model 'flash' yang lebih baru
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
}