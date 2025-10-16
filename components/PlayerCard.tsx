import React from 'react'
import { Player } from "@/types"
import { 
  FlagIcon, 
  calculateAge, 
  getPositionCategory,
  getPositionColor, 
} from '@/lib/utils'

// === Composant PlayerCard (EXPORT PAR DÉFAUT) ===
export default function PlayerCard({ player }: { player: Player }) {
  const age = player.dateOfBirth ? calculateAge(player.dateOfBirth) : null
  const positionColor = getPositionColor(player.position || '')

  return (
    <div className="group relative">
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
  )
}

// === Composant de regroupement (EXPORT NOMMÉ) ===
export function GroupedPlayersList({ players }: { players: Player[] }) {
  // Grouper les joueurs par catégorie
  const groupedPlayers = players.reduce((acc, player) => {
    const category = getPositionCategory(player.position || '')
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(player)
    return acc
  }, {} as Record<string, Player[]>)

  // Trier les catégories par priorité
  const sortedCategories = Object.keys(groupedPlayers).sort((a, b) => {
    const priorityMap: Record<string, number> = {
      'Gardiens': 1,
      'Défenseurs': 2,
      'Milieux': 3,
      'Attaquants': 4,
      'Autres': 99
    }
    return (priorityMap[a] || 99) - (priorityMap[b] || 99)
  })

  const categoryColors: Record<string, string> = {
    'Gardiens': 'from-yellow-600 to-amber-600',
    'Défenseurs': 'from-blue-600 to-indigo-600',
    'Milieux': 'from-green-600 to-emerald-600',
    'Attaquants': 'from-red-600 to-rose-600',
    'Autres': 'from-slate-600 to-slate-700'
  }

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
              <PlayerCard key={index} player={player} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}