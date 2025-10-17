
import { Match } from "@/types"
import MatchCard from "./MatchCard"

type MatchListProps = {
  matches: Match[]
  teamId: number
}

export default function MatchList({ matches, teamId }: MatchListProps) {
  return (
    <div className="space-y-4">
      {/* Liste des matchs */}
      <div className="space-y-3">
        {(!matches || matches.length === 0) ? (
          <p className="text-slate-400 text-center py-6">Aucun match disponible</p>
        ) : (
          matches.map((m) => (
            <MatchCard key={m.id} match={m} teamId={teamId} />
          ))
        )}
      </div>
    </div>
  )
}
