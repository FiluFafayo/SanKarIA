import { useState, useEffect } from "react";
import { auth } from "./firebase"; // <-- Impor mesin auth kita
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";
import Modal from "./components/Modal";
import CharacterCreator from "./features/creation/CharacterCreator";
import CombatSimulator from "./features/combat/CombatSimulator";
import CharacterSheet from "./features/character/CharacterSheet";
import DMChat from "./features/ai/DMChat";
import Lobby from "./features/multiplayer/Lobby";
import GameSession from "./features/multiplayer/GameSession"; // Impor GameSession

function App() {
	const backgroundImageUrl =
		"https://i.ibb.co.com/WNDDPp1K/dreamina-2025-10-15-6572-A-vast-cavernous-interior-of-a-magical.jpg";

	// State untuk menyimpan data pengguna yang sedang login
	const [user, setUser] = useState(null);
	const [activeModal, setActiveModal] = useState(null);
	const [currentSessionId, setCurrentSessionId] = useState(null);

	// Listener untuk memantau perubahan status login
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
		// Cleanup listener saat komponen tidak lagi digunakan
		return () => unsubscribe();
	}, []);

	// Fungsi untuk handle login
	const handleLogin_full = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Error saat login:", error);
		}
	};

	// Fungsi untuk handle logout
	const handleLogout_full = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error saat logout:", error);
		}
	};

	// Fungsi untuk menutup modal dan mereset state sesi
	const handleCloseModal = () => {
		setActiveModal(null);
		setCurrentSessionId(null);
	};

	const HARDCODED_CHARACTER_ID = "wvKjrx3IgTQunFDbNCIu";

	return (
		<div
			className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white p-4"
			style={{ backgroundImage: `url(${backgroundImageUrl})` }}
		>
			<div className="absolute inset-0 bg-black opacity-60"></div>

			{/* Header Aplikasi (Login/Logout) */}
			<div className="absolute top-5 right-5 z-20">
				{user ? (
					<div className="flex items-center gap-4">
						<img
							src={user.photoURL}
							alt={user.displayName}
							className="w-10 h-10 rounded-full border-2 border-gray-400"
						/>
						<span className="font-semibold">{user.displayName}</span>
						<button
							onClick={handleLogout_full}
							className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
						>
							Logout
						</button>
					</div>
				) : (
					<button
						onClick={handleLogin_full}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
					>
						Login dengan Google
					</button>
				)}
			</div>

			{/* Konten Utama */}
			<div className="relative z-10 text-center container mx-auto">
				<header className="mb-12">
					<h1
						className="text-6xl font-extrabold drop-shadow-lg"
						style={{ fontFamily: "serif" }}
					>
						SanKarIA
					</h1>
					<p className="text-xl text-gray-300 mt-2">Pusat Sinergi</p>
				</header>

				{/* 3. Grid diubah jadi 4 kolom */}
				<main className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div
						onClick={() => setActiveModal("MenaraKreasi")}
						className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer"
					>
						<h2 className="text-2xl font-bold">Menara Kreasi</h2>
						<p className="text-gray-400 mt-2">Mulai petualangan baru.</p>
					</div>

					{/* 4. Bangunan baru ditambahkan */}
					<div
						onClick={() => setActiveModal("CerminPersona")}
						className="border-2 border-yellow-400 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer ring-2 ring-yellow-500/50"
					>
						<h2 className="text-2xl font-bold">Cermin Persona</h2>
						<p className="text-gray-400 mt-2">Ciptakan & kelola pahlawanmu.</p>
					</div>

					<div
						onClick={() => setActiveModal("ArsipPetualangan")}
						className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer"
					>
						<h2 className="text-2xl font-bold">Arsip Petualangan</h2>
						<p className="text-gray-400 mt-2">Lanjutkan kisahmu.</p>
					</div>

					<div
						onClick={() => setActiveModal("TerminalLintas")}
						className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer"
					>
						<h2 className="text-2xl font-bold">Terminal Lintas</h2>
						<p className="text-gray-400 mt-2">Bergabung dengan teman.</p>
					</div>
				</main>
			</div>

			{/* Render Modal secara kondisional */}
			{activeModal === "MenaraKreasi" && (
				<Modal title="Sesi Petualangan" onClose={() => setActiveModal(null)}>
					<DMChat />
				</Modal>
			)}

			{activeModal === "ArsipPetualangan" && (
				<Modal title="Lembar Karakter" onClose={() => setActiveModal(null)}>
					{HARDCODED_CHARACTER_ID.startsWith("GANTI") ? (
						<p className="text-yellow-400">
							Edit file App.jsx dan ganti nilai HARDCODED_CHARACTER_ID dengan ID
							karakter dari Firestore.
						</p>
					) : (
						<CharacterSheet characterId={HARDCODED_CHARACTER_ID} />
					)}
				</Modal>
			)}

			{/* Upgrade Modal TerminalLintas */}
      {activeModal === 'TerminalLintas' && (
        <Modal title="Terminal Lintas Multiplayer" onClose={handleCloseModal}>
          {currentSessionId ? (
            // Jika sudah ada ID sesi, tampilkan ruang game
            <GameSession sessionId={currentSessionId} />
          ) : (
            // Jika tidak, tampilkan lobby
            <Lobby onSessionCreated={setCurrentSessionId} />
          )}
        </Modal>
      )}

			{/* 5. Modal baru untuk Character Creator */}
			{activeModal === "CerminPersona" && (
				<Modal title="Ciptakan Pahlawanmu" onClose={() => setActiveModal(null)}>
					<CharacterCreator closeModal={() => setActiveModal(null)} />
				</Modal>
			)}
		</div>
	);
}

export default App;
