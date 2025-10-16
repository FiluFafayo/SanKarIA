// src/features/community/CampaignMarketplace.jsx
import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function CampaignCard({ campaign }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-yellow-500 transition-colors">
      <h3 className="text-xl font-bold text-yellow-400">{campaign.title}</h3>
      <p className="text-sm text-gray-400 mt-2 mb-4 h-16 overflow-hidden">{campaign.description}</p>
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Lihat Detail & Kloning
      </button>
    </div>
  );
}

function CampaignMarketplace() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const q = query(collection(db, "campaigns"), where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);
        const publicCampaigns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCampaigns(publicCampaigns);
      } catch (err) {
        console.error("Gagal mengambil kampanye publik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <p className="text-center">Mencari petualangan baru...</p>;

  return (
    <div>
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-400">Belum ada petualangan yang dipublikasikan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}
        </div>
      )}
    </div>
  );
}
export default CampaignMarketplace;