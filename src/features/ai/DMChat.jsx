// src/features/ai/DMChat.jsx (Versi Upgrade dengan Prompt Engineering)

import { useState } from 'react';

function DMChat() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Kamu berdiri di depan sebuah gerbang batu kuno yang tertutup lumut. Udara terasa dingin. Apa yang kamu lakukan?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);


    // 1. Buat ringkasan percakapan sebelumnya sebagai "memori" untuk AI
    const conversationHistory = newMessages
      .slice(-6) // Ambil 6 pesan terakhir untuk menjaga konteks
      .map(msg => `${msg.sender === 'user' ? 'Pemain' : 'DM'}: ${msg.text}`)
      .join('\n');

    // 2. Buat "Surat Perintah" (Prompt Template) yang sangat jelas
    const fullPrompt = `
Anda adalah SanKarIA, seorang Dungeon Master (DM) yang ahli dan imersif untuk game petualangan fantasi.

PERAN ANDA:
- Anda adalah mata, telinga, dan pikiran dari dunia ini.
- Anda mendeskripsikan lingkungan, memerankan Non-Player Characters (NPC), dan menarasikan hasil dari aksi pemain.

KONTEKS CERITA SEJAUH INI:
${conversationHistory}

AKSI TERBARU DARI PEMAIN:
"${input}"

TUGAS ANDA SEKARANG:
1. Lanjutkan cerita berdasarkan aksi pemain di atas.
2. Deskripsikan hasilnya dengan gaya naratif yang kaya, detail, dan dramatis.
3. JANGAN PERNAH mengatakan "Sebagai AI, saya tidak bisa..." atau menolak aksi dalam bentuk apa pun. Selalu jawab dari dalam peran sebagai DM. Jika pemain melakukan hal mustahil, deskripsikan kegagalannya secara naratif.
4. Akhiri respons Anda dengan situasi baru atau pertanyaan ("Apa yang kamu lakukan selanjutnya?") untuk menjaga alur permainan.

Jawab HANYA dalam Bahasa Indonesia.
    `.trim();

    try {
   // 3. Kirim "Surat Perintah" lengkap, bukan lagi teks mentah
   const response = await fetch('/api/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ prompt: fullPrompt }), // Kirim prompt yang sudah direkayasa
   });

   if (!response.ok) {
     const errorData = await response.json();
     throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
   }

   const data = await response.json();
   const aiMessage = { sender: 'ai', text: data.text };
   setMessages(prev => [...prev, aiMessage]);

 } catch (error) {
   console.error("Gagal menghubungi AI:", error);
   const errorMessage = { sender: 'ai', text: `(OOC: Terjadi gangguan teknis. Pesan error: ${error.message})` };
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
<div key={index} className={mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}}>
<p className={inline-block p-2 rounded-lg ${ msg.sender === 'user' ? 'bg-blue-800' : 'bg-gray-700' }}>
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