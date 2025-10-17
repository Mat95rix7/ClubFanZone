'use client'

import { useStandings } from '../hooks/useStandings'
import { StandingPosition } from '@/types'

interface StandingsTabProps {
  competitionId: number | null
  teamId: number
}

export default function StandingsTab({ competitionId, teamId }: StandingsTabProps) {
  const { standings, loading, error } = useStandings(competitionId)

  if (!competitionId) {
    return (
      <EmptyStandings message="Sélectionnez une compétition pour voir le classement" />
    )
  }

  if (loading) {
    return <LoadingStandings />
  }

  if (error) {
    return <EmptyStandings message={error} icon="error" />
  }

  if (!standings?.standings?.[0]?.table) {
    return <EmptyStandings message="Aucun classement disponible pour cette compétition" />
  }

  const table = standings.standings[0].table

  // Détermine les zones de qualification selon la compétition
  const getPositionColor = (position: number, code: string) => {
    // Champions League / Europa League zones
    if (['PL', 'PD', 'SA', 'BL1', 'FL1'].includes(code)) {
      if (position <= 4) return 'bg-blue-500/10 border-l-4 border-blue-500'
      if (position <= 6) return 'bg-orange-500/10 border-l-4 border-orange-500'
      if (position >= table.length - 2) return 'bg-red-500/10 border-l-4 border-red-500'
    }
    return ''
  }

  return (
    <div className="space-y-4">
      {/* En-tête de la compétition */}
      <div className="flex items-center gap-3 p-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
        {standings.competition.emblem && (
          <img
            src={standings.competition.emblem}
            alt={standings.competition.name}
            className="w-12 h-12 object-contain"
          />
        )}
        <div>
          <h3 className="text-lg font-bold text-white">
            {standings.competition.name}
          </h3>
          <p className="text-sm text-slate-400">
            Journée {standings.season.currentMatchday}
          </p>
        </div>
      </div>

      {/* Tableau desktop */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-800/50">
        <table className="w-full">
          <thead className="bg-slate-900/50 backdrop-blur-sm">
            <tr className="text-xs text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 text-left">Pos</th>
              <th className="py-3 px-4 text-left">Équipe</th>
              <th className="py-3 px-2 text-center">J</th>
              <th className="py-3 px-2 text-center">V</th>
              <th className="py-3 px-2 text-center">N</th>
              <th className="py-3 px-2 text-center">D</th>
              <th className="py-3 px-2 text-center">BP</th>
              <th className="py-3 px-2 text-center">BC</th>
              <th className="py-3 px-2 text-center">Diff</th>
              <th className="py-3 px-4 text-center font-bold">Pts</th>
              <th className="py-3 px-4 text-center">Forme</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900/30 backdrop-blur-sm">
            {table.map((row: StandingPosition) => {
              const isUserTeam = row.team.id === teamId
              const positionColor = getPositionColor(
                row.position,
                standings.competition.code
              )

              return (
                <tr
                  key={row.team.id}
                  className={`border-t border-slate-800/50 transition-all ${
                    isUserTeam
                      ? 'bg-indigo-500/20 hover:bg-indigo-500/30'
                      : 'hover:bg-slate-800/50'
                  } ${positionColor}`}
                >
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        isUserTeam ? 'text-indigo-300' : 'text-slate-300'
                      }`}
                    >
                      {row.position}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.team.crest}
                        alt={row.team.name}
                        className="w-6 h-6 object-contain"
                      />
                      <span
                        className={`font-medium ${
                          isUserTeam ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {row.team.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400 text-sm">
                    {row.playedGames}
                  </td>
                  <td className="py-3 px-2 text-center text-green-400 text-sm font-medium">
                    {row.won}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-400 text-sm">
                    {row.draw}
                  </td>
                  <td className="py-3 px-2 text-center text-red-400 text-sm font-medium">
                    {row.lost}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-300 text-sm">
                    {row.goalsFor}
                  </td>
                  <td className="py-3 px-2 text-center text-slate-300 text-sm">
                    {row.goalsAgainst}
                  </td>
                  <td
                    className={`py-3 px-2 text-center text-sm font-medium ${
                      row.goalDifference > 0
                        ? 'text-green-400'
                        : row.goalDifference < 0
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {row.goalDifference > 0 ? '+' : ''}
                    {row.goalDifference}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-bold text-lg ${
                        isUserTeam ? 'text-indigo-300' : 'text-white'
                      }`}
                    >
                      {row.points}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {row.form && <FormIndicator form={row.form} />}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Vue mobile */}
      <div className="lg:hidden space-y-2">
        {table.map((row: StandingPosition) => {
          const isUserTeam = row.team.id === teamId
          const positionColor = getPositionColor(
            row.position,
            standings.competition.code
          )

          return (
            <div
              key={row.team.id}
              className={`p-4 rounded-xl border transition-all ${
                isUserTeam
                  ? 'bg-indigo-500/20 border-indigo-500/50'
                  : 'bg-slate-900/50 border-slate-800/50'
              } ${positionColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-lg font-bold ${
                      isUserTeam ? 'text-indigo-300' : 'text-slate-300'
                    }`}
                  >
                    {row.position}
                  </span>
                  <img
                    src={row.team.crest}
                    alt={row.team.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span
                    className={`font-medium ${
                      isUserTeam ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {row.team.shortName || row.team.name}
                  </span>
                </div>
                <span
                  className={`text-xl font-bold ${
                    isUserTeam ? 'text-indigo-300' : 'text-white'
                  }`}
                >
                  {row.points} pts
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-slate-500">J</div>
                  <div className="text-slate-300 font-medium">
                    {row.playedGames}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">V-N-D</div>
                  <div className="text-slate-300 font-medium">
                    {row.won}-{row.draw}-{row.lost}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Buts</div>
                  <div className="text-slate-300 font-medium">
                    {row.goalsFor}:{row.goalsAgainst}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-slate-500">Diff</div>
                  <div
                    className={`font-medium ${
                      row.goalDifference > 0
                        ? 'text-green-400'
                        : row.goalDifference < 0
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {row.goalDifference > 0 ? '+' : ''}
                    {row.goalDifference}
                  </div>
                </div>
              </div>

              {row.form && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <FormIndicator form={row.form} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Légende */}
      <StandingsLegend competitionCode={standings.competition.code} />
    </div>
  )
}

// Composants auxiliaires
function FormIndicator({ form }: { form: string }) {
  return (
    <div className="flex gap-1 justify-center">
      {form.split('').slice(-5).map((result, i) => (
        <span
          key={i}
          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            result === 'W'
              ? 'bg-green-500 text-white'
              : result === 'D'
              ? 'bg-slate-600 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {result}
        </span>
      ))}
    </div>
  )
}

function LoadingStandings() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Chargement du classement...</p>
      </div>
    </div>
  )
}

function EmptyStandings({ message, icon = 'table' }: { message: string; icon?: string }) {
  const iconPath =
    icon === 'error'
      ? 'M6 18L18 6M6 6l12 12'
      : 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 bg-slate-800/40 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
        <svg
          className="w-10 h-10 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={iconPath}
          />
        </svg>
      </div>
      <p className="text-slate-300 text-lg font-semibold">{message}</p>
    </div>
  )
}

function StandingsLegend({ competitionCode }: { competitionCode: string }) {
  const legends = ['PL', 'PD', 'SA', 'BL1', 'FL1'].includes(competitionCode)
    ? [
        { color: 'bg-blue-500', label: 'Ligue des Champions' },
        { color: 'bg-orange-500', label: 'Europa League' },
        { color: 'bg-red-500', label: 'Relégation' },
      ]
    : []

  if (legends.length === 0) return null

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-slate-900/30 rounded-xl border border-slate-800/50">
      {legends.map((legend) => (
        <div key={legend.label} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${legend.color}`}></div>
          <span className="text-xs text-slate-400">{legend.label}</span>
        </div>
      ))}
    </div>
  )
}