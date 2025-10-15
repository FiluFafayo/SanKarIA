// api/generate.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Akses kunci API yang sudah kita simpan di Vercel
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

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