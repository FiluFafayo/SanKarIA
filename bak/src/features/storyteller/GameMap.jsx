// src/features/storyteller/GameMap.jsx

function PlayerToken({ player, position }) {
	// Token sederhana berupa lingkaran berwarna dengan inisial
	return (
		<div
			className="absolute w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-lg"
			style={{
				left: `${position.x}px`,
				top: `${position.y}px`,
				transform: "translate(-50%, -50%)", // Pusatkan token di koordinat
			}}
			title={player.id}
		>
			{player.id.substring(0, 2).toUpperCase()}
		</div>
	);
}

// Komponen GameMap sekarang menerima prop onMapClick
function GameMap({ mapUrl, players, tokenPositions, onMapClick }) {
	if (!mapUrl) {
		return (
			<div className="text-center p-8 bg-gray-800 rounded-lg">
				Tidak ada peta untuk sesi ini.
			</div>
		);
	}

	const handleMapClick = (event) => {
		// Dapatkan area klik dari elemen peta
		const rect = event.currentTarget.getBoundingClientRect();
		// Hitung koordinat X dan Y di dalam elemen
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		// Panggil fungsi yang diberikan dari induk (GameSession)
		onMapClick({ x, y });
	};

	return (
		// onMapClick ditempatkan di sini!
		<div
			onClick={handleMapClick}
			className="relative w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600 cursor-pointer"
		>
			<img
				src={mapUrl}
				alt="Peta Pertempuran"
				className="w-full h-full object-cover"
			/>

			{players.map((playerId) => {
				const position = tokenPositions[playerId];
				if (!position) return null;
				return (
					<PlayerToken
						key={playerId}
						player={{ id: playerId }}
						position={position}
					/>
				);
			})}
		</div>
	);
}

export default GameMap;
