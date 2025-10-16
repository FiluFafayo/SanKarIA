// src/features/multiplayer/Lobby.jsx (Versi Upgrade)
import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Lobby({ onSessionCreated }) {
        // <-- Prop baru di sini
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleCreateSession = async () => {
		if (!auth.currentUser) {
			setError("Kamu harus login.");
			return;
		}
		setIsLoading(true);
		setError("");
		try {
			const sessionData_full = {
				hostId: auth.currentUser.uid,
				createdAt: serverTimestamp(),
				players: [auth.currentUser.uid],
				gameState: {
					currentTurn: auth.currentUser.uid,
					chatLog: [{ sender: "system", text: "Sesi permainan dimulai!" }],
				},
			};
			const docRef = await addDoc(collection(db, "sessions"), sessionData_full);
			onSessionCreated(docRef.id); // <-- Panggil fungsi dari App.jsx dengan ID baru
		} catch (err) {
			console.error("Gagal membuat sesi:", err);
			setError("Gagal membuat sesi. Cek aturan keamanan.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="text-left space-y-6">
			<div>
				<h3 className="text-xl font-bold mb-2">Buat Sesi Baru</h3>
				<p className="text-gray-400 text-sm mb-4">
					Mulai petualangan baru dan undang teman-temanmu.
				</p>
				<button
					onClick={handleCreateSession}
					disabled={isLoading}
					className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
				>
					{isLoading ? "Membuat..." : "Buat Sesi"}
				</button>
			</div>
			<div className="border-t border-gray-600 pt-6">
				<h3 className="text-xl font-bold mb-2">Gabung Sesi Teman</h3>
				<p className="text-gray-400 text-sm mb-4">
					Masukkan kode sesi yang diberikan oleh temanmu.
				</p>
				<div className="flex gap-2">
					<input
						type="text"
						className="flex-grow bg-gray-700 border border-gray-600 text-white text-sm rounded-lg p-2.5"
						placeholder="Ketik kode sesi..."
					/>
					<button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg">
						Gabung
					</button>
				</div>
			</div>
			{error && <p className="text-red-500 text-center mt-4">{error}</p>}
		</div>
	);
}

export default Lobby;
