// src/features/storyteller/StorytellerToolkit.jsx (Versi Upgrade)
import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function StorytellerToolkit({ onCampaignCreated }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mapFile, setMapFile] = useState(null); // <-- State untuk file peta
	const [mapUrl, setMapUrl] = useState(""); // <-- State untuk URL setelah upload
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");
	const [isPublic, setIsPublic] = useState(false);

	const handleFileChange = (event) => {
		setMapFile(event.target.files?.[0] || null);
	};

	const handleUploadMap = async () => {
		if (!mapFile) return;
		setIsUploading(true);
		setError("");

		try {
			const response = await fetch(`/api/upload?filename=${mapFile.name}`, {
				method: "POST",
				body: mapFile,
			});
			const newBlob = await response.json();
			setMapUrl(newBlob.url); // Simpan URL yang dikembalikan Vercel Blob
		} catch (err) {
			console.error("Gagal mengunggah peta:", err);
			setError("Gagal mengunggah peta.");
		} finally {
			setIsUploading(false);
		}
	};

	const handleSaveCampaign = async () => {
		if (!title.trim() || !description.trim()) {
			setError("Judul dan deskripsi tidak boleh kosong.");
			return;
		}
		if (!auth.currentUser) {
			setError("Kamu harus login untuk menyimpan kampanye.");
			return;
		}
		setIsSaving(true);
		const campaignData = {
			title,
			description,
			storytellerId: auth.currentUser.uid,
			createdAt: serverTimestamp(),
			mapUrl: mapUrl, // <-- Simpan URL peta ke Firestore
			isPublic: isPublic, // <-- Simpan status publikasi
		};

		try {
			await addDoc(collection(db, "campaigns"), campaignData);
			alert(`Kampanye "${title}" berhasil disimpan!`);
			// Reset form
			setTitle("");
			setDescription("");
			setMapFile(null);
			setMapUrl("");
		} catch (err) {
			console.error("Gagal menyimpan kampanye: ", err);
			setError("Gagal menyimpan kampanye. Cek aturan keamanan Firestore.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="text-left space-y-4">
			<h3 className="text-2xl font-bold">Ciptakan Petualangan Baru</h3>
			<div>
				<label
					htmlFor="campaignTitle"
					className="block mb-2 text-sm font-medium text-gray-300"
				>
					Judul Kampanye:
				</label>
				<input
					type="text"
					id="campaignTitle"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
					placeholder="Contoh: Misteri Hutan Terlarang"
				/>
			</div>
			<div>
				<label
					htmlFor="campaignDescription"
					className="block mb-2 text-sm font-medium text-gray-300"
				>
					Deskripsi Singkat:
				</label>
				<textarea
					id="campaignDescription"
					rows="4"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
					placeholder="Jelaskan premis utama dari petualangan yang akan kamu buat..."
				></textarea>
			</div>
			<div>
				<label className="block mb-2 text-sm font-medium text-gray-300">
					Peta Pertempuran (Opsional):
				</label>
				<div className="flex gap-2">
					<input
						type="file"
						onChange={handleFileChange}
						className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
					/>
					<button
						onClick={handleUploadMap}
						disabled={!mapFile || isUploading}
						className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
					>
						{isUploading ? "..." : "Upload"}
					</button>
				</div>
			</div>

			{mapUrl && (
				<div className="border-t border-gray-600 pt-4">
					<p className="text-sm text-gray-300 mb-2">Pratinjau Peta:</p>
					<img
						src={mapUrl}
						alt="Pratinjau Peta"
						className="rounded-lg w-full object-cover"
					/>
				</div>
			)}

			{/* Checkbox Publikasi Baru */}
			<div className="flex items-center border-t border-gray-600 pt-4">
				<input
					id="isPublic"
					type="checkbox"
					checked={isPublic}
					onChange={(e) => setIsPublic(e.target.checked)}
					className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
				/>
				<label
					htmlFor="isPublic"
					className="ml-2 text-sm font-medium text-gray-300"
				>
					Publikasikan ke Pasar Gagasan?
				</label>
			</div>

			<button
				onClick={handleSaveCampaign}
				disabled={isSaving || !mapUrl}
				className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
			>
				{isSaving ? "Menyimpan..." : "Simpan Kampanye"}
			</button>
			{error && (
				<p className="text-red-500 text-center text-sm mt-2">{error}</p>
			)}
		</div>
	);
}
export default StorytellerToolkit;
