// src/features/multiplayer/Lobby.jsx (Versi Upgrade)
import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Lobby({ onSessionCreated }) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleCreateSession = async () => {
		if (!auth.currentUser) {
			setError("Kamu harus login.");
			return;
		}
		setIsLoading(true);
		setError("");

		// HARDCODE: Tempel URL peta dari Vercel Blob yang berhasil kamu upload di sini.
		const campaignMapUrl =
			"https://7tl6q839zga1wfib.public.blob.vercel-storage.com/WhatsApp%20Image%202025-10-13%20at%2013.16.45%20%281%29-QpvTwUmjyt9dU4a85Q6uiy7VpmXjJ9.jpeg";

		// Atur posisi awal untuk host
		const initialTokenPositions = {
			[auth.currentUser.uid]: { x: 100, y: 100 }, // Posisi awal di koordinat 100x100
		};

		const sessionData = {
			hostId: auth.currentUser.uid,
			createdAt: serverTimestamp(),
			players: [auth.currentUser.uid],
			mapUrl: campaignMapUrl, // <-- Simpan URL peta di sesi
			gameState: {
				currentTurn: auth.currentUser.uid,
				chatLog: [
					{ sender: "system", text: "Sesi permainan dimulai di atas peta!" },
				],
				tokenPositions: initialTokenPositions, // <-- Simpan posisi token
			},
		};

		try {
			const docRef = await addDoc(collection(db, "sessions"), sessionData);
			onSessionCreated(docRef.id);
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
