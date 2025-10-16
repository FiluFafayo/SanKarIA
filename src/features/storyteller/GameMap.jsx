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

function GameMap({ mapUrl, players, tokenPositions }) {
	if (!mapUrl) {
		return (
			<div className="text-center p-8 bg-gray-800 rounded-lg">
				Tidak ada peta untuk sesi ini.
			</div>
		);
	}

	return (
		<div className="relative w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
			<img
				src={mapUrl}
				alt="Peta Pertempuran"
				className="w-full h-full object-cover"
			/>

			{/* Render semua token pemain */}
			{players.map((playerId) => {
				const position = tokenPositions[playerId];
				if (!position) return null; // Jangan render jika pemain belum punya posisi

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
