import { CompetitionSubTab, TabConfig } from "@/types"
import useCompetitionFilters from "../hooks/useCompetitionFilters"
import useNextMatch from "../hooks/useNextMatch"
import MatchCard from "@/components/MatchCard"
import MatchList from "@/components/MatchList"
import TabNavigation from "./TabNavigation"
import EmptyState from "./EmptyState"
import StandingsTab from "./StandingsTab"


export default function CompetitionsTab({ 
  teamInfo, 
  teamId,
  lastMatches, 
  nextMatches,
  selectedCompetition,
  onCompetitionChange,
  competitionTab,
  onCompetitionTabChange 
}: {
  teamInfo: any
  teamId: number
  lastMatches: any[]
  nextMatches: any[]
  selectedCompetition: number | "all"
  onCompetitionChange: (id: number | "all") => void
  competitionTab: CompetitionSubTab
  onCompetitionTabChange: (tab: CompetitionSubTab) => void
}) {
  if (!teamInfo.runningCompetitions || teamInfo.runningCompetitions.length === 0) {
    return (
      <EmptyState
        icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        message="Aucune compétition en cours"
      />
    )
  }

  const { filteredLast, filteredNext } = useCompetitionFilters(selectedCompetition, lastMatches, nextMatches)
  const nextMatch = useNextMatch(lastMatches, nextMatches)

  const filteredLastWithoutNext = filteredLast.filter((m) => m.id !== nextMatch?.id)
  const filteredNextWithoutNext = filteredNext.filter((m) => m.id !== nextMatch?.id)

  const competitionTabs: TabConfig[] = [
    { id: "last", label: "Derniers matchs", icon: "", count: filteredLastWithoutNext.length },
    { id: "next", label: "Prochains matchs", icon: "", count: filteredNextWithoutNext.length },
    { id: "standings", label: "Classement", icon: "" },
  ]

  return (
    <div className="space-y-4">
      {/* Sélecteur de compétition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={() => onCompetitionChange("all")}
          className={`group relative flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
            selectedCompetition === "all"
              ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
              : "bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60"
          }`}
        >
          <span className="text-sm md:text-base font-medium">Toutes les compétitions</span>
        </button>

        {teamInfo.runningCompetitions.map((c: any) => (
          <button
            key={c.id}
            onClick={() => onCompetitionChange(c.id)}
            className={`group relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              selectedCompetition === c.id
                ? "bg-indigo-500/20 border-indigo-500/50"
                : "bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60"
            }`}
          >
            {c.emblem && (
              <img src={c.emblem} alt={c.name} className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0" />
            )}
            <span className={`text-sm md:text-base font-medium flex-1 text-left ${
              selectedCompetition === c.id ? "text-indigo-300" : "text-slate-300"
            }`}>
              {c.name}
            </span>
            {selectedCompetition === c.id && (
              <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Prochain match */}
      {nextMatch && (
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">Prochain match</h3>
          <MatchCard match={nextMatch} teamId={teamId} />
        </div>
      )}

      {/* Sous-onglets */}
      <TabNavigation 
        tabs={competitionTabs} 
        activeTab={competitionTab} 
        onTabChange={(tab) => onCompetitionTabChange(tab as CompetitionSubTab)} 
      />

      {/* Contenu */}
      <div className="animate-fadeIn">
        {competitionTab === "last" && (
          filteredLastWithoutNext.length > 0 ? (
            <MatchList matches={filteredLastWithoutNext} teamId={teamId} />
          ) : (
            <EmptyState icon="M12 4v16m8-8H4" message="Aucun match récent pour cette compétition" />
          )
        )}

        {competitionTab === "next" && (
          filteredNextWithoutNext.length > 0 ? (
            <MatchList matches={filteredNextWithoutNext} teamId={teamId} />
          ) : (
            <EmptyState icon="M12 4v16m8-8H4" message="Aucun match prévu pour cette compétition" />
          )
        )}

        {competitionTab === "standings" && (
          <StandingsTab 
            competitionId={selectedCompetition === "all" ? null : selectedCompetition} 
            teamId={teamId} 
          />
        )}
      </div>
    </div>
  )
}