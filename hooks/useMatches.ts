import useSWR from 'swr'
import { getLastMatches } from '../lib/api'

export const useMatches = (teamId?: number) => {
  const { data, error } = useSWR(teamId ? ['matches', teamId] : null, async () => (await getLastMatches(teamId!)).response ?? [])
  return { matches: data, isLoading: !error && !data, isError: !!error }
}