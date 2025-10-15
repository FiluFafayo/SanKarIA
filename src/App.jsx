function App() {
  // URL Gambar Latar Belakang - Ganti dengan URL gambar pilihanmu nanti
  const backgroundImageUrl = 'https://i.ibb.co.com/WNDDPp1K/dreamina-2025-10-15-6572-A-vast-cavernous-interior-of-a-magical.jpg';

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white p-4"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      {/* Lapisan Gelap untuk Keterbacaan Teks */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Konten Utama */}
      <div className="relative z-10 text-center">
        <header className="mb-12">
          <h1 className="text-6xl font-extrabold drop-shadow-lg" style={{ fontFamily: 'serif' }}>
            SanKarIA
          </h1>
          <p className="text-xl text-gray-300 mt-2">Pusat Sinergi</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Placeholder untuk bangunan-bangunan interaktif nanti */}
          <div className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer">
            <h2 className="text-2xl font-bold">Menara Kreasi</h2>
            <p className="text-gray-400 mt-2">Mulai petualangan baru.</p>
          </div>

          <div className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer">
            <h2 className="text-2xl font-bold">Arsip Petualangan</h2>
            <p className="text-gray-400 mt-2">Lanjutkan kisahmu.</p>
          </div>

          <div className="border-2 border-gray-500 rounded-lg p-6 bg-black bg-opacity-50 hover:bg-opacity-75 transition-all cursor-pointer">
            <h2 className="text-2xl font-bold">Terminal Lintas</h2>
            <p className="text-gray-400 mt-2">Bergabung dengan teman.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;