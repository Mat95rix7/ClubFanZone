export default function useCompetitionFilters(selectedCompetition: number | "all", lastMatches: any[], nextMatches: any[]) {
  return {
    filteredLast: selectedCompetition === "all"
      ? lastMatches
      : lastMatches.filter((m) => m.competition?.id === selectedCompetition),
    filteredNext: selectedCompetition === "all"
      ? nextMatches
      : nextMatches.filter((m) => m.competition?.id === selectedCompetition),
  }
}