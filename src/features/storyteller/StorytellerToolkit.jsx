// src/features/storyteller/StorytellerToolkit.jsx

import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function StorytellerToolkit({ onCampaignCreated }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState("");

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
		setError("");

		const campaignData = {
			title: title,
			description: description,
			storytellerId: auth.currentUser.uid,
			createdAt: serverTimestamp(),
			isPublic: false, // Default tidak publik
			// Di sini kita akan menambahkan data lain seperti peta, NPC, dll.
		};

		try {
			const docRef = await addDoc(collection(db, "campaigns"), campaignData);
			alert(`Kampanye "${title}" berhasil disimpan!`);
			if (onCampaignCreated) {
				onCampaignCreated(docRef.id);
			}
			setTitle("");
			setDescription("");
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
			<button
				onClick={handleSaveCampaign}
				disabled={isSaving}
				className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-500"
			>
				{isSaving ? "Menyimpan..." : "Simpan Kerangka Kampanye"}
			</button>
			{error && (
				<p className="text-red-500 text-center text-sm mt-2">{error}</p>
			)}
		</div>
	);
}

export default StorytellerToolkit;
