import { useState, useEffect } from 'react';
import { auth } from './firebase'; // <-- Impor mesin auth kita
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const backgroundImageUrl = 'https://i.ibb.co.com/WNDDPp1K/dreamina-2025-10-15-6572-A-vast-cavernous-interior-of-a-magical.jpg';

  // State untuk menyimpan data pengguna yang sedang login
  const [user, setUser] = useState(null);

  // Listener untuk memantau perubahan status login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    // Cleanup listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  // Fungsi untuk handle login
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error saat login:", error);
    }
  };

  // Fungsi untuk handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error)
    {
      console.error("Error saat logout:", error);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white p-4"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Header Aplikasi */}
      <div className="absolute top-5 right-5 z-20">
        {user ? (
          // Tampilan jika SUDAH login
          <div className="flex items-center gap-4">
            <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full border-2 border-gray-400" />
            <span className="font-semibold">{user.displayName}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Logout
            </button>
          </div>
        ) : (
          // Tampilan jika BELUM login
          <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Login dengan Google
          </button>
        )}
      </div>

      <div className="relative z-10 text-center">
        <header className="mb-12">
          <h1 className="text-6xl font-extrabold drop-shadow-lg" style={{ fontFamily: 'serif' }}>
            SanKarIA
          </h1>
          <p className="text-xl text-gray-300 mt-2">Pusat Sinergi</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
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