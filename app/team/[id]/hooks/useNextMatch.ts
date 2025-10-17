export default function useNextMatch(lastMatches: any[], nextMatches: any[]) {
  const allMatches = [...lastMatches, ...nextMatches]
  const upcomingMatches = allMatches
    .filter((m) => new Date(m.utcDate) > new Date())
    .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  return upcomingMatches[0] || null
}