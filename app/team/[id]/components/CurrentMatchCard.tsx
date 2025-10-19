"use client"

import { useEffect, useState } from 'react'
import MatchStatistics from './MatchStatistics'

interface CurrentMatchProps {
  match: {
    id: number
    homeTeam: {
      id: number
      name: string
      logo: string
    }
    awayTeam: {
      id: number
      name: string
      logo: string
    }
    score: {
      home: number
      away: number
    }
    status: string
    minute: number
    competition: {
      id: number
      name: string
      logo: string
    }
    startTime: string
    halfTimeScore?: {
      home: number | null
      away: number | null
    }
    venue?: string
    referee?: string
    attendance?: number
    statistics?: any
  }
  teamId: number
}

export default function CurrentMatchCard({ match, teamId }: CurrentMatchProps) {
  const [pulse, setPulse] = useState(false)
  const [previousScore, setPreviousScore] = useState({ home: match.score.home, away: match.score.away })
  const [isExpanded, setIsExpanded] = useState(false)
  const isHomeTeam = match.homeTeam.id === teamId

  useEffect(() => {
    if (match.score.home !== previousScore.home || match.score.away !== previousScore.away) {
      setPulse(true)
      const timer = setTimeout(() => setPulse(false), 600)
      setPreviousScore({ home: match.score.home, away: match.score.away })
      return () => clearTimeout(timer)
    }
  }, [match.score.home, match.score.away, previousScore])

  const getStatusLabel = () => {
    if (match.status === 'LIVE' || match.status === 'IN_PLAY') return 'EN DIRECT'
    if (match.status === 'HT') return 'MI-TEMPS'
    if (match.status === 'PAUSED') return 'PAUSE'
    return 'EN DIRECT'
  }

  const getStatusColor = () => {
    if (match.status === 'HT') return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
    return 'bg-red-500/20 border-red-500/50 text-red-400'
  }

  const getPulseColor = () => {
    if (match.status === 'HT') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-3">
      {/* Badge EN DIRECT */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-4 py-2 border rounded-full ${getStatusColor()}`}>
          <div className={`w-2 h-2 ${getPulseColor()} rounded-full animate-pulse`} />
          <span className="font-bold text-sm uppercase tracking-wide">
            {getStatusLabel()}
          </span>
          {match.minute > 0 && match.status !== 'HT' && (
            <span className="font-semibold text-sm">
              {match.minute}'
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span>Mise à jour auto</span>
        </div>
      </div>

      {/* Carte du match */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* En-tête compétition */}
        <div className="flex items-center justify-between gap-2 px-6 pt-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            {match.competition.logo && (
              <img
                src={match.competition.logo}
                alt={match.competition.name}
                className="w-6 h-6 object-contain"
              />
            )}
            <span className="text-slate-300 text-sm font-medium">
              {match.competition.name}
            </span>
          </div>
          
          {/* Bouton pour plus d'infos */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>{isExpanded ? 'Moins' : 'Plus'} d'infos</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Score principal */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between gap-6">
            {/* Équipe domicile */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                />
                {isHomeTeam && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-base md:text-lg leading-tight">
                  {match.homeTeam.name}
                </p>
                <p className="text-slate-500 text-xs mt-1">Domicile</p>
              </div>
            </div>

            {/* Score central */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <div className={`text-5xl md:text-6xl font-bold transition-all duration-300 ${
                  pulse && isHomeTeam 
                    ? 'scale-125 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                    : 'text-white'
                }`}>
                  {match.score.home}
                </div>
                <div className="text-3xl md:text-4xl text-slate-600 font-light">-</div>
                <div className={`text-5xl md:text-6xl font-bold transition-all duration-300 ${
                  pulse && !isHomeTeam 
                    ? 'scale-125 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
                    : 'text-white'
                }`}>
                  {match.score.away}
                </div>
              </div>
              
              {/* Score mi-temps */}
              {match.halfTimeScore && (match.halfTimeScore.home !== null || match.halfTimeScore.away !== null) && (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="text-xs">Mi-temps:</span>
                  <span className="font-semibold">
                    {match.halfTimeScore.home} - {match.halfTimeScore.away}
                  </span>
                </div>
              )}

              {match.status === 'HT' && (
                <div className="text-yellow-400 text-sm font-semibold bg-yellow-500/10 px-3 py-1 rounded-full">
                  Pause
                </div>
              )}
            </div>

            {/* Équipe extérieure */}
            <div className="flex-1 flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                />
                {!isHomeTeam && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-base md:text-lg leading-tight">
                  {match.awayTeam.name}
                </p>
                <p className="text-slate-500 text-xs mt-1">Extérieur</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires (collapsible) */}
        <div className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-6 pb-6 pt-2 border-t border-slate-700/50 space-y-3">
            <h4 className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">
              Détails du match
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {/* Date et heure */}
              <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Date et heure</p>
                  <p className="text-slate-200 font-medium text-xs leading-tight">
                    {formatDate(match.startTime)}
                  </p>
                </div>
              </div>

              {/* Stade */}
              {match.venue && (
                <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Stade</p>
                    <p className="text-slate-200 font-medium text-xs">{match.venue}</p>
                  </div>
                </div>
              )}

              {/* Arbitre */}
              {match.referee && (
                <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Arbitre</p>
                    <p className="text-slate-200 font-medium text-xs">{match.referee}</p>
                  </div>
                </div>
              )}

              {/* Affluence */}
              {match.attendance && (
                <div className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                  <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="text-slate-400 text-xs mb-0.5">Affluence</p>
                    <p className="text-slate-200 font-medium text-xs">
                      {match.attendance.toLocaleString('fr-FR')} spectateurs
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques en direct */}
            {match.statistics && match.statistics.length > 0 && (
              <div className="mt-4">
                <MatchStatistics statistics={match.statistics} />
              </div>
            )}

            {/* Lien vers les détails */}
            <a
              href={`/match/${match.id}`}
              className="flex items-center justify-center gap-2 mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <span>Voir tous les détails du match</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}