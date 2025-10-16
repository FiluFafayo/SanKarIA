// src/features/ai/DMChat.jsx (Versi Final dengan Suara)
import { useState, useEffect } from "react";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis"; // <-- Impor hook kita

function DMChat() {
	const [messages, setMessages] = useState([
		{
			sender: "ai",
			text: "Kamu berdiri di depan sebuah gerbang batu kuno. Udara terasa dingin. Suaraku kini terdengar... Apa yang kamu lakukan?",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isMuted, setIsMuted] = useState(false); // <-- State untuk Mute
	const { speak, cancel, isSpeaking } = useSpeechSynthesis(); // <-- Gunakan hook-nya

	const handleSend = async () => {
		if (!input.trim()) return;
		cancel(); // Hentikan suara yang mungkin masih berjalan

		const userMessage = { sender: "user", text: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			// Kirim prompt ke jembatan serverless kita!
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: input }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			const aiMessage = { sender: "ai", text: data.text };
			setMessages((prev) => [...prev, aiMessage]);

			// Panggil fungsi speak jika tidak di-mute!
			if (!isMuted) {
				speak(data.text);
			}
		} catch (error) {
			console.error("Gagal menghubungi AI:", error);
			const errorMessage = {
				sender: "ai",
				text: "Maaf, sepertinya ada gangguan pada koneksi kosmik... Coba lagi.",
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-[50vh]">
			{/* Kotak Pesan */}
			<div className="flex-grow bg-gray-900 rounded-t-lg p-4 overflow-y-auto">
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`mb-4 ${
							msg.sender === "user" ? "text-right" : "text-left"
						}`}
					>
						<p
							className={`inline-block p-2 rounded-lg ${
								msg.sender === "user" ? "bg-blue-800" : "bg-gray-700"
							}`}
						>
							{msg.text}
						</p>
					</div>
				))}
				{isLoading && (
					<p className="text-gray-400 text-center animate-pulse">
						DM sedang berpikir...
					</p>
				)}
			</div>

			{/* Input & Tombol Kirim */}
			<div className="flex bg-gray-700 rounded-b-lg p-2 items-center">
				{/* Tombol Mute/Unmute Baru */}
				<button
					onClick={() => setIsMuted(!isMuted)}
					className="p-2 mr-2 bg-gray-600 hover:bg-gray-500 rounded-full"
				>
					{isMuted ? "🔇" : "🔊"}
				</button>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
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
