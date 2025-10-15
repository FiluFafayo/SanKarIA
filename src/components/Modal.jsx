// src/components/Modal.jsx

function Modal({ title, children, onClose }) {
  return (
    // Lapisan Latar Belakang (Backdrop)
    <div 
      onClick={onClose} 
      className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center"
    >
      {/* Konten Modal */}
      <div 
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat konten di dalamnya diklik
        className="relative bg-gray-800 border-2 border-gray-600 rounded-lg shadow-xl p-8 w-11/12 md:w-1/2 lg:w-1/3 text-white"
      >
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          &times;
        </button>

        {/* Judul Modal */}
        <h2 className="text-3xl font-bold mb-4">{title}</h2>

        {/* Konten dinamis dari modal */}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;