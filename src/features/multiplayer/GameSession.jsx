// src/features/multiplayer/GameSession.jsx

import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

function GameSession({ sessionId }) {
	const [sessionData, setSessionData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);

	// INILAH INTI DARI REAL-TIME: onSnapshot
	useEffect(() => {
		const docRef = doc(db, "sessions", sessionId);

		// Langganan (subscribe) ke perubahan dokumen
		const unsubscribe = onSnapshot(docRef, (docSnap) => {
			if (docSnap.exists()) {
				setSessionData(docSnap.data());
			} else {
				setError("Sesi tidak ditemukan atau telah dihapus.");
			}
			setLoading(false);
		});

		// Fungsi cleanup: berhenti langganan saat komponen tidak lagi ditampilkan
		return () => unsubscribe();
	}, [sessionId]);

	// FUNGSI BARU UNTUK MENGIRIM PESAN
	const handleSendMessage = async () => {
		if (!input.trim() || !auth.currentUser) return;
		setIsSending(true);

		const sessionRef = doc(db, "sessions", sessionId);
		const message = {
			sender: auth.currentUser.uid,
			text: input,
			timestamp: new Date(), // Tambahkan timestamp
		};

		try {
			// Gunakan updateDoc dan arrayUnion untuk menambahkan pesan baru
			await updateDoc(sessionRef, {
				"gameState.chatLog": arrayUnion(message),
			});
			setInput(""); // Kosongkan input setelah berhasil
		} catch (err) {
			console.error("Gagal mengirim pesan:", err);
			alert("Gagal mengirim pesan. Cek aturan keamananmu.");
		} finally {
			setIsSending(false);
		}
	};

	if (loading) return <p>Memasuki sesi...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!sessionData) return null;

	return (
		<div className="flex flex-col h-[80vh]">
			{" "}
			{/* Tinggikan sedikit modalnya */}
			{/* Bagian Peta Taktis */}
			<div className="mb-4">
				<GameMap
					mapUrl={sessionData.mapUrl}
					players={sessionData.players}
					tokenPositions={sessionData.gameState.tokenPositions}
				/>
			</div>
			{/* Bagian Obrolan */}
			<div className="flex flex-col flex-grow">
				<h3 className="text-lg font-bold mb-2">Log Petualangan</h3>
				<div className="flex-grow bg-gray-900 rounded-t-lg p-4 overflow-y-auto">
					{sessionData.gameState.chatLog.map((msg, index) => (
						<div key={index} className="mb-2">
							{/* Kita buat tampilan lebih informatif */}
							<p
								className={`p-2 rounded-lg text-sm ${
									msg.sender === "system"
										? "bg-yellow-800 text-yellow-200"
										: msg.sender === auth.currentUser?.uid
										? "bg-blue-800 text-right"
										: "bg-gray-700"
								}`}
							>
								<span className="font-bold text-xs block">
									{msg.sender === "system"
										? "SYSTEM"
										: `Pemain_${msg.sender.substring(0, 5)}`}
								</span>
								{msg.text}
							</p>
						</div>
					))}
				</div>
				<div className="flex bg-gray-700 rounded-b-lg p-2">
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyPress={(e) =>
							e.key === "Enter" && !isSending && handleSendMessage()
						}
						className="flex-grow bg-gray-800 rounded-l-md p-2 focus:outline-none"
						placeholder="Ketik aksimu sebagai pemain..."
						disabled={isSending}
					/>
					<button
						onClick={handleSendMessage}
						disabled={isSending}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-r-md disabled:bg-gray-500"
					>
						{isSending ? "..." : "Kirim"}
					</button>
				</div>
			</div>
		</div>
	);
}

export default GameSession;
