import React, { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Player } from "@/types";
import { 
  FlagIcon, 
  calculateAge, 
  getPositionCategory,
  getPositionColor, 
} from '@/lib/utils';
import { usePlayerStats } from '@/hooks/usePlayerStats';

// === Modal Détaillée avec Stats ===
function PlayerDetailModal({ player, league, isOpen, onClose }: { 
  player: Player; 
  league: number;
  isOpen: boolean; 
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const age = player.dateOfBirth ? calculateAge(player.dateOfBirth) : null;
  const positionColor = getPositionColor(player.position || '');
  const category = getPositionCategory(player.position || '');

  // Charger les statistiques depuis API-Football
  const { stats, loading, error } = usePlayerStats(player.name, 2023, league);
  
  // Extraire les stats de la saison actuelle
  const currentSeasonStats = stats?.statistics?.[0];
  const playerInfo = stats?.player;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header avec dégradé */}
        <div className={`relative h-32 bg-gradient-to-r ${positionColor} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          {/* Numéro de maillot en arrière-plan */}
          {(player.shirtNumber || currentSeasonStats?.games?.number) && (
            <div className="absolute bottom-0 right-8 text-white/10 font-black text-9xl leading-none">
              {player.shirtNumber || currentSeasonStats?.games?.number}
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="p-8">
          {/* En-tête joueur */}
          <div className="flex items-start gap-6 mb-8">
            {/* Photo du joueur */}
            <div className="flex-shrink-0">
              {playerInfo?.photo ? (
                <img 
                  src={playerInfo.photo} 
                  alt={player.name}
                  className="w-24 h-24 rounded-2xl border-2 border-slate-600 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-600 ${playerInfo?.photo ? 'hidden' : ''}`}>
                <span className="text-4xl font-black text-slate-400">
                  {player.name?.charAt(0) || '?'}
                </span>
              </div>
            </div>

            {/* Info principale */}
            <div className="flex-1">
              <h2 className="text-3xl font-black text-white mb-2">
                {player.name || 'Joueur inconnu'}
              </h2>
              
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {player.position && (
                  <span className={`px-4 py-1.5 bg-gradient-to-r ${positionColor} text-white text-sm font-bold rounded-full`}>
                    {player.position}
                  </span>
                )}
                {(player.shirtNumber || currentSeasonStats?.games?.number) && (
                  <span className="px-4 py-1.5 bg-slate-800 text-white text-sm font-bold rounded-full border border-slate-700">
                    N°{player.shirtNumber || currentSeasonStats?.games?.number}
                  </span>
                )}
                {playerInfo?.injured && (
                  <span className="px-4 py-1.5 bg-red-900/50 text-red-300 text-sm font-bold rounded-full border border-red-700">
                    🤕 Blessé
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {player.nationality && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <FlagIcon nationality={player.nationality} />
                  <span className="text-xs text-slate-500 uppercase font-semibold">Nationalité</span>
                </div>
                <p className="text-white font-semibold">{player.nationality}</p>
              </div>
            )}

            {age && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-2">Âge</span>
                <p className="text-white font-semibold text-2xl">{age} ans</p>
              </div>
            )}

            {playerInfo?.height && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-2">Taille</span>
                <p className="text-white font-semibold">{playerInfo.height}</p>
              </div>
            )}

            {playerInfo?.weight && (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <span className="text-xs text-slate-500 uppercase font-semibold block mb-2">Poids</span>
                <p className="text-white font-semibold">{playerInfo.weight}</p>
              </div>
            )}

            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-xs text-slate-500 uppercase font-semibold block mb-2">Catégorie</span>
              <p className="text-white font-semibold">{category}</p>
            </div>
          </div>

          {/* Section statistiques */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-800/10 rounded-xl p-6 border border-slate-700/30">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Statistiques de la saison</h3>
              {currentSeasonStats?.league?.season && (
                <span className="text-sm text-slate-400">({currentSeasonStats.league.season})</span>
              )}
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-slate-400 mt-2">Chargement des statistiques...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-4">
                <p className="text-slate-500 text-sm">{error}</p>
              </div>
            )}

            {currentSeasonStats && !loading && (
              <>
                {/* Stats principales */}
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-3xl font-black text-white mb-1">
                      {currentSeasonStats.games?.appearences || 0}
                    </div>
                    <div className="text-xs text-slate-400 uppercase">Matchs</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-400 mb-1">
                      {currentSeasonStats.goals?.total || 0}
                    </div>
                    <div className="text-xs text-slate-400 uppercase">Buts</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-400 mb-1">
                      {currentSeasonStats.goals?.assists || 0}
                    </div>
                    <div className="text-xs text-slate-400 uppercase">Passes D.</div>
                  </div>
                </div>
              </>
            )}

            {!currentSeasonStats && !loading && !error && (
              <p className="text-xs text-slate-500 text-center py-4">
                💡 Statistiques non disponibles pour ce joueur
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// === PlayerCard ===
export default function PlayerCard({ player, league }: { player: Player; league: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const age = player.dateOfBirth ? calculateAge(player.dateOfBirth) : null;
  const positionColor = getPositionColor(player.position || '');

  return (
    <>
      <div 
        className="group relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${positionColor} rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-300`}></div>

        <div className="relative bg-slate-900/80 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105 h-full flex flex-col">
          <h3 className="font-bold text-white text-center mb-2 line-clamp-2 min-h-[3rem] flex items-center justify-center">
            {player.name || 'Joueur inconnu'}
          </h3>

          {player.position && (
            <div className="text-center mb-3">
              <span className="text-xs px-3 py-1 bg-slate-800/50 rounded-full text-slate-300 border border-slate-700/50">
                {player.position}
              </span>
            </div>
          )}

          <div className="mt-auto space-y-2 pt-3 border-t border-slate-700/50">
            {player.nationality && (
              <div className="flex justify-center items-center gap-2 text-sm">
                <FlagIcon nationality={player.nationality} />
                <span className="text-slate-400 truncate">{player.nationality}</span>
              </div>
            )}

            {age && (
              <div className="flex justify-center items-center gap-2 text-sm">
                <span className="text-slate-400">{age} ans</span>
              </div>
            )}

            {player.dateOfBirth && (
              <div className="flex justify-center items-center gap-2 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Né le {new Date(player.dateOfBirth).toLocaleDateString("fr-FR")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <PlayerDetailModal 
        player={player}
        league={league}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

// === GroupedPlayersList ===
export function GroupedPlayersList({ players, league }: { players: Player[]; league: number }) {
  const groupedPlayers = players.reduce((acc, player) => {
    const category = getPositionCategory(player.position || '');
    if (!acc[category]) acc[category] = [];
    acc[category].push(player);
    return acc;
  }, {} as Record<string, Player[]>);

  const sortedCategories = Object.keys(groupedPlayers).sort((a, b) => {
    const priorityMap: Record<string, number> = {
      'Gardiens': 1,
      'Défenseurs': 2,
      'Milieux': 3,
      'Attaquants': 4,
      'Autres': 99
    };
    return (priorityMap[a] || 99) - (priorityMap[b] || 99);
  });

  const categoryColors: Record<string, string> = {
    'Gardiens': 'from-yellow-600 to-amber-600',
    'Défenseurs': 'from-blue-600 to-indigo-600',
    'Milieux': 'from-green-600 to-emerald-600',
    'Attaquants': 'from-red-600 to-rose-600',
    'Autres': 'from-slate-600 to-slate-700'
  };

  return (
    <div className="space-y-8">
      {sortedCategories.map(category => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`h-1 w-12 bg-gradient-to-r ${categoryColors[category]} rounded-full`}></div>
            <h2 className="text-2xl font-bold text-white">{category}</h2>
            <span className="text-slate-500 text-sm">({groupedPlayers[category].length})</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {groupedPlayers[category].map((player, index) => (
              <PlayerCard key={index} player={player} league={league} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
