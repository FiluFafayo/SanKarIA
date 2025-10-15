// api/_utils/resilient-requester.js

const API_KEYS = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    // Tambahkan process.env.GEMINI_API_KEY_2, dst. di sini jika ada
].filter(Boolean);

const MODELS = [
    { name: 'gemini-1.5-flash-latest', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent' },
    { name: 'gemini-1.5-pro-latest', url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent' },
];

// Fungsi untuk mengacak array (Fisher-Yates shuffle algorithm)
const shuffleArray_full = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

export default async function makeResilientRequest(payload) {
    let lastKnownError = null;

    if (API_KEYS.length === 0) {
        throw new Error("Tidak ada GEMINI_API_KEY yang dikonfigurasi.");
    }

    const shuffledApiKeys = shuffleArray_full([...API_KEYS]);

    for (const model of MODELS) {
        for (const apiKey of shuffledApiKeys) {
            const keyIndex = API_KEYS.indexOf(apiKey) + 1;
            console.log(`[SanKarIA AI] Mencoba Model: ${model.name} dengan Kunci #${keyIndex}`);

            try {
                const apiResponse = await fetch(`${model.url}?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!apiResponse.ok) {
                    const errorData = await apiResponse.json().catch(() => ({ error: { message: "Gagal parse error JSON" } }));
                    const errorMessage = errorData.error?.message || `HTTP Status ${apiResponse.status}`;
                    lastKnownError = new Error(`API Error (${apiResponse.status}): ${errorMessage}`);
                    console.warn(`[SanKarIA AI] Gagal dengan Kunci #${keyIndex}, Model ${model.name}. Pesan: ${errorMessage}. Mencoba kombinasi berikutnya...`);
                    continue;
                }

                const data = await apiResponse.json();
                console.log(`[SanKarIA AI] SUKSES dengan Model: ${model.name}, Kunci #${keyIndex}`);
                return data;

            } catch (error) {
                lastKnownError = error;
                console.error(`[SanKarIA AI] Error Jaringan/Fetch pada Kunci #${keyIndex}, Model ${model.name}.`, error);
            }
        }
    }

    console.error("[SanKarIA AI] FATAL: Semua kombinasi Model dan Kunci gagal.", lastKnownError);
    throw lastKnownError || new Error("Semua opsi AI fallback habis.");
}