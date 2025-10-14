"use client"

import { Match } from "../lib/api"

type MatchCardProps = {
  match: Match
  teamId?: number // l'id de l'équipe principale pour mettre en évidence
}

export default function MatchCard({ match, teamId }: MatchCardProps) {
  const homeTeam = match.homeTeam
  const awayTeam = match.awayTeam
  const scoreHome = match.score?.fullTime?.home
  const scoreAway = match.score?.fullTime?.away

  // Déterminer si le match est joué
  const isPlayed = typeof scoreHome === "number" && typeof scoreAway === "number"

  // Vérifie si l'équipe principale est à domicile ou à l'extérieur
  const isHome = homeTeam?.id === teamId
  const isAway = awayTeam?.id === teamId

  // Déterminer le résultat pour la mise en couleur
  let resultText = ""
  if (isPlayed && teamId) {
    const teamScore = isHome ? scoreHome : scoreAway
    const opponentScore = isHome ? scoreAway : scoreHome
    if (teamScore > opponentScore) resultText = "Victoire"
    else if (teamScore < opponentScore) resultText = "Défaite"
    else resultText = "Nul"
  }

  // Couleur selon résultat
  const scoreColor = isPlayed
    ? resultText === "Victoire"
      ? "bg-green-500/30 text-green-400"
      : resultText === "Défaite"
      ? "bg-red-500/30 text-red-400"
      : "bg-yellow-500/20 text-yellow-300"
    : "bg-slate-700/20 text-slate-400" // prochains matchs

  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
            {/* Date */}
      {match.utcDate && (
        <div className="ml-4 text-slate-400 text-sm">
          {new Date(match.utcDate).toLocaleDateString("fr-FR")}
        </div>
      )}
      {/* Équipe domicile */}
      <div className={`flex-1 text-right font-medium ${isHome ? "text-indigo-400" : ""}`}>
        {homeTeam?.name}
      </div>

      {/* Score */}
      <div className={`px-3 py-1 rounded-lg font-bold ${scoreColor} mx-4`}>
        {isPlayed
          ? `${scoreHome} - ${scoreAway}`
          : "– –" /* tirets pour les prochains matchs */}
      </div>

      {/* Équipe extérieur */}
      <div className={`flex-1 text-left font-medium ${isAway ? "text-indigo-400" : ""}`}>
        {awayTeam?.name}
      </div>


    </div>
  )
}
