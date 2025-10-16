import { useState, useEffect } from "react";
import { auth } from "./firebase";
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";

// Placeholder Components - Nanti akan kita ganti dengan komponen asli
const StorytellerToolkit = () => <div>Konten Storyteller Toolkit di sini.</div>;
const DMChat = () => <div>Konten DM Chat di sini.</div>;
const CharacterSheet = () => <div>Konten Character Sheet di sini.</div>;
const Lobby = () => <div>Konten Lobby Multiplayer di sini.</div>;
const CampaignMarketplace = () => (
	<div>Konten Campaign Marketplace di sini.</div>
);

const HARDCODED_CHARACTER_ID = "wvKjrx3IgTQunFDbNCIu";

function App() {
	const backgroundImageUrl =
		"https://i.ibb.co.com/WNDDPp1K/dreamina-2025-10-15-6572-A-vast-cavernous-interior-of-a-magical.jpg";

	const [user, setUser] = useState(null);
	const [modalId, setModalId] = useState(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
			setUser(currentUser)
		);
		return () => unsubscribe();
	}, []);

	const handleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.error("Error saat login:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error("Error saat logout:", error);
		}
	};

	const openModal = (id) => document.getElementById(id).showModal();

	const buildings = [
		{
			id: "menara_kreasi",
			title: "Menara Kreasi",
			description: "Ciptakan petualangan baru.",
			modalContent: <StorytellerToolkit />,
			borderColor: "border-yellow-500",
		},
		{
			id: "cermin_persona",
			title: "Cermin Persona",
			description: "Lihat & kelola pahlawanmu.",
			modalContent: <CharacterSheet characterId={HARDCODED_CHARACTER_ID} />,
			borderColor: "border-cyan-500",
		},
		{
			id: "arsip_petualangan",
			title: "Arsip Petualangan",
			description: "Lanjutkan sesi solo.",
			modalContent: <DMChat />,
			borderColor: "border-purple-500",
		},
		{
			id: "terminal_lintas",
			title: "Terminal Lintas",
			description: "Bermain bersama teman.",
			modalContent: <Lobby />,
			borderColor: "border-red-500",
		},
		{
			id: "pasar_gagasan",
			title: "Pasar Gagasan",
			description: "Jelajahi karya komunitas.",
			modalContent: <CampaignMarketplace />,
			borderColor: "border-green-500",
		},
	];

	return (
		<div
			className="hero min-h-screen"
			style={{ backgroundImage: `url(${backgroundImageUrl})` }}
		>
			<div className="hero-overlay bg-opacity-70 backdrop-blur-sm"></div>

			{/* Header Pengguna */}
			<div className="absolute top-4 right-4 z-20">
				{user ? (
					<div className="dropdown dropdown-end">
						<div
							tabIndex={0}
							role="button"
							className="btn btn-ghost btn-circle avatar"
						>
							<div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
								<img alt="User Avatar" src={user.photoURL} />
							</div>
						</div>
						<ul
							tabIndex={0}
							className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
						>
							<li className="menu-title">
								<span>{user.displayName}</span>
							</li>
							<li>
								<button onClick={handleLogout}>Logout</button>
							</li>
						</ul>
					</div>
				) : (
					<button onClick={handleLogin} className="btn btn-primary">
						Login dengan Google
					</button>
				)}
			</div>

			<div className="hero-content text-center text-neutral-content">
				<div className="max-w-4xl">
					<h1
						className="mb-5 text-7xl font-bold font-serif tracking-wider"
						style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
					>
						SanKarIA
					</h1>
					<p className="mb-5 text-lg">
						Gerbang menuju petualangan tanpa batas, ditenagai oleh imajinasi dan
						kecerdasan buatan.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
						{buildings.map((building) => (
							<div
								key={building.id}
								className={`card bg-base-100/30 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${building.borderColor}`}
								onClick={() => openModal(building.id)}
							>
								<div className="card-body items-center text-center p-4">
									<h2 className="card-title text-base">{building.title}</h2>
									<p className="text-xs">{building.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Kumpulan Modal */}
			{buildings.map((building) => (
				<dialog key={building.id} id={building.id} className="modal">
					<div className="modal-box w-11/12 max-w-5xl bg-base-200/80 backdrop-blur-lg border border-gray-700">
						<h3 className="font-bold text-2xl mb-4">{building.title}</h3>
						{building.modalContent}
						<div className="modal-action">
							<form method="dialog">
								<button className="btn">Tutup</button>
							</form>
						</div>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button>close</button>
					</form>
				</dialog>
			))}
		</div>
	);
}

export default App;
