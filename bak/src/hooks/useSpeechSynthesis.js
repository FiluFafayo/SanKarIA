// src/hooks/useSpeechSynthesis.js
import { useState, useEffect } from "react";

export function useSpeechSynthesis() {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const synth = window.speechSynthesis;

	const speak = (text) => {
		if (synth.speaking) {
			console.error("SpeechSynthesis.speaking");
			return;
		}
		if (text !== "") {
			const utterThis = new SpeechSynthesisUtterance(text);
			utterThis.lang = "id-ID"; // Set bahasa ke Indonesia
			utterThis.onend = () => setIsSpeaking(false);
			utterThis.onerror = (event) => {
				console.error("SpeechSynthesisUtterance.onerror", event);
				setIsSpeaking(false);
			};
			setIsSpeaking(true);
			synth.speak(utterThis);
		}
	};

	const cancel = () => {
		synth.cancel();
		setIsSpeaking(false);
	};

	useEffect(() => {
		return () => {
			// Pastikan suara berhenti jika komponen di-unmount
			synth.cancel();
		};
	}, [synth]);

	return { speak, cancel, isSpeaking };
}
