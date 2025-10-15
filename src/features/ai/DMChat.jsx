// src/features/ai/DMChat.jsx

import { useState } from 'react';

function DMChat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Kamu berdiri di depan sebuah gerbang batu kuno yang tertutup lumut. Udara terasa dingin. Apa yang kamu lakukan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Kirim prompt ke jembatan serverless kita!
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.text };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Gagal menghubungi AI:", error);
      const errorMessage = { sender: 'ai', text: 'Maaf, sepertinya ada gangguan pada koneksi kosmik... Coba lagi.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[50vh]">
      {/* Kotak Pesan */}
      <div className="flex-grow bg-gray-900 rounded-t-lg p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <p className={`inline-block p-2 rounded-lg ${
              msg.sender === 'user' ? 'bg-blue-800' : 'bg-gray-700'
            }`}>
              {msg.text}
            </p>
          </div>
        ))}
        {isLoading && <p className="text-gray-400 text-center animate-pulse">DM sedang berpikir...</p>}
      </div>

      {/* Input & Tombol Kirim */}
      <div className="flex bg-gray-700 rounded-b-lg p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          className="flex-grow bg-gray-800 text-white rounded-l-md p-2 focus:outline-none"
          placeholder="Ketik aksimu di sini..."
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-r-md transition-colors disabled:bg-gray-500"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default DMChat;