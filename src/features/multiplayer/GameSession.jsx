// src/features/multiplayer/GameSession.jsx

import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot } from "firebase/firestore";

function GameSession({ sessionId }) {
	const [sessionData, setSessionData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

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

	if (loading) return <p>Memasuki sesi...</p>;
	if (error) return <p className="text-red-500">{error}</p>;
	if (!sessionData) return null;

	return (
		<div className="flex flex-col h-[60vh]">
			<h3 className="text-lg font-bold mb-2">Pemain di Sesi Ini:</h3>
			<ul className="flex gap-2 mb-4">
				{sessionData.players.map((playerId) => (
					<li
						key={playerId}
						className="bg-gray-700 text-xs px-2 py-1 rounded-full"
						title={playerId}
					>
						Pemain_{playerId.substring(0, 5)}
					</li>
				))}
			</ul>

			<h3 className="text-lg font-bold mb-2">Log Petualangan</h3>
			<div className="flex-grow bg-gray-900 rounded-t-lg p-4 overflow-y-auto">
				{sessionData.gameState.chatLog.map((msg, index) => (
					<div key={index} className="mb-2">
						<p
							className={`p-2 rounded-lg text-sm ${
								msg.sender === "system"
									? "bg-yellow-800 text-yellow-200"
									: "bg-gray-700"
							}`}
						>
							{msg.text}
						</p>
					</div>
				))}
			</div>

			<div className="flex bg-gray-700 rounded-b-lg p-2">
				<input
					type="text"
					className="flex-grow bg-gray-800 rounded-l-md p-2 focus:outline-none"
					placeholder="Kirim pesan..."
				/>
				<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-r-md">
					Kirim
				</button>
			</div>
		</div>
	);
}

export default GameSession;
