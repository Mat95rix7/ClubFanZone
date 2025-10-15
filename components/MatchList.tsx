import { useState } from "react"
import { Match } from "@/types"
import MatchCard from "./MatchCard"

type MatchListProps = {
  matches: Match[]
  teamId: number
}

export default function MatchList({ matches, teamId }: MatchListProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<string>("all")

  // Extraire les compétitions uniques
  const competitions = Array.from(
    // new Set(matches.map((m) => m.competition?.name).filter(Boolean))
    new Set(matches.map((m) => m.competition?.name).filter((name): name is string => Boolean(name)))
  )

  // Filtrer selon la compétition sélectionnée
  const filteredMatches =
    selectedCompetition === "all"
      ? matches
      : matches.filter((m) => m.competition?.name === selectedCompetition)

  return (
    <div className="space-y-4">
      {/* Filtre */}
      {competitions.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            className={`px-3 py-1 rounded-lg ${
              selectedCompetition === "all"
                ? "bg-indigo-500 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            onClick={() => setSelectedCompetition("all")}
          >
            Toutes
          </button>
          {competitions.map((c) => (
            <button
              key={c}
              className={`px-3 py-1 rounded-lg ${
                selectedCompetition === c
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
              onClick={() => setSelectedCompetition(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Liste des matchs */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <p className="text-slate-400 text-center py-6">Aucun match disponible</p>
        ) : (
          filteredMatches.map((m) => <MatchCard key={m.id} match={m} teamId={teamId} />)
        )}
      </div>
    </div>
  )
}
