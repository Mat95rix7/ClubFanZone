"use client";

import { useEffect, useState } from "react";

interface Trophy {
  league: string;
  season: string;
  place: string;
  country: string;
}

export default function TrophiesPage() {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/trophies?team=85")
      .then((res) => res.json())
      .then((data) => {
        if (data.response) {
          setTrophies(data.response);
        } else {
          setError("Aucun trophée trouvé");
        }
      })
      .catch((err) => setError("Erreur API : " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement… ⏳</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Palmarès du PSG 🏆
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trophies.map((trophy, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col justify-between hover:scale-105 transition-transform"
          >
            <h2 className="text-lg font-semibold">{trophy.league}</h2>
            <p className="text-gray-600">{trophy.country}</p>
            <p className="mt-2 font-medium">
              Saison : <span className="text-blue-600">{trophy.season}</span>
            </p>
            <p className="mt-1 text-green-600 font-semibold">{trophy.place}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
