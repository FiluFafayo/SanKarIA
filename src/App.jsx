// src/App.jsx
import { useEffect, useState } from 'react';
import { Howl } from 'howler';
import DiceTray from './components/DiceTray';

// Data untuk bangunan di Pusat Sinergi
const buildings = [
  { id: 'CerminPersona', name: 'Cermin Persona', description: 'Ciptakan & kelola pahlawanmu.', color: 'border-yellow-400', modalTitle: 'Profil Pahlawan' },
  { id: 'MenaraKreasi', name: 'Menara Kreasi', description: 'Rancang petualangan barumu.', color: 'border-blue-400', modalTitle: 'Alat Bantu Storyteller' },
  { id: 'ArsipPetualangan', name: 'Arsip Petualangan', description: 'Lanjutkan kisah solomu.', color: 'border-green-400', modalTitle: 'Lanjutkan Petualangan Solo' },
  { id: 'TerminalLintas', name: 'Terminal Lintas', description: 'Bermain bersama teman.', color: 'border-red-400', modalTitle: 'Terminal Lintas Multiplayer' },
  { id: 'PasarGagasan', name: 'Pasar Gagasan', description: 'Jelajahi karya komunitas.', color: 'border-purple-400', modalTitle: 'Pasar Gagasan Komunitas' },
  { id: 'RuangKalibrasi', name: 'Ruang Kalibrasi', description: 'Atur API Key & preferensi.', color: 'border-gray-400', modalTitle: 'Pengaturan & Kalibrasi' }
];

// Komponen Kartu Bangunan yang Didesain Ulang
function BuildingCard({ building, onClick }) {
  return (
    <div
      className={`card bg-base-100 bg-opacity-20 backdrop-blur-md shadow-xl border-2 ${building.color} transition-all duration-300 hover:bg-opacity-40 hover:scale-105 cursor-pointer`}
      onClick={onClick}
    >
      <div className="card-body items-center text-center">
        <h2 className="card-title font-cinzel text-2xl text-white">{building.name}</h2>
        <p className="text-gray-300">{building.description}</p>
      </div>
    </div>
  );
}

function App() {
  const [activeModalId, setActiveModalId] = useState(null);

  // Efek untuk memutar musik latar belakang
  useEffect(() => {
    const sound = new Howl({
      src: ['/assets/audio/bgm.mp3'],
      autoplay: true,
      loop: true,
      volume: 0.3,
      html5: true, // Penting untuk autoplay di browser modern
    });
    // Cleanup saat komponen di-unmount
    return () => sound.unload();
  }, []);

  const openModal = (id) => {
    document.getElementById(id).showModal();
    setActiveModalId(id);
  };
  
  const activeBuilding = buildings.find(b => b.id === activeModalId);

  return (
    <main data-theme="sankaria_dark" className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Video Latar Belakang */}
      <video autoPlay loop muted className="absolute z-0 w-auto min-w-full min-h-full max-w-none">
        <source src="/assets/video/bg-video.mp4" type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Konten Utama */}
      <div className="relative z-10 container mx-auto p-4 text-center">
        <h1 className="font-cinzel text-7xl md:text-9xl font-bold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mb-12">
          SanKarIA
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map(building => (
            <BuildingCard key={building.id} building={building} onClick={() => openModal(building.id)} />
          ))}
        </div>
      </div>

      {/* Modal Universal yang Didesain Ulang */}
      {activeBuilding && (
        <dialog id={activeBuilding.id} className="modal">
          <div className="modal-box w-11/12 max-w-3xl bg-base-100 bg-opacity-50 backdrop-blur-lg border-2 border-primary">
            <h3 className="font-cinzel text-3xl text-primary">{activeBuilding.modalTitle}</h3>
            <div className="py-4">
              {/* Di sini kita akan menempatkan konten spesifik tiap modal nanti */}
              <p>Konten untuk {activeBuilding.name} akan muncul di sini.</p>
              {/* Contoh integrasi dadu untuk diuji */}
              {activeBuilding.id === 'CerminPersona' && <DiceTray />}
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Tutup</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}

export default App;