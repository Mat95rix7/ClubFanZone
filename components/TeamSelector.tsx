"use client"

import { useEffect, useState } from 'react'
import { useTeamStore } from '../store/useTeamStore'
import { getTeams } from '../lib/api'

type Team = { id: number; name: string; crest?: string }

export default function TeamSelector({ competitionId }: { competitionId: number }) {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const setTeamId = useTeamStore((s) => s.setTeamId)

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const data = await getTeams(competitionId)
        setTeams(data)
        console.log(data)
      } catch (err) {
        console.error("Erreur récupération équipes :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [competitionId])

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700/50"
            ></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Rechercher une équipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {filteredTeams.length} équipe{filteredTeams.length > 1 ? 's' : ''} trouvée{filteredTeams.length > 1 ? 's' : ''}
        </span>
        {searchTerm && (
          <span className="text-indigo-400 font-medium">
            Recherche: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Teams grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredTeams.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => setTeamId(t.id)}
            className="group relative flex items-center gap-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden text-left"
            style={{
              animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500"></div>

            {/* Left accent line */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

            {/* Team crest */}
            {t.crest && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900/80 backdrop-blur-sm p-2 border border-slate-700/30 group-hover:border-indigo-500/50 group-hover:scale-110 transition-all duration-300">
                  <img
                    src={t.crest}
                    alt={t.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Team name */}
            <div className="relative flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
                {t.name}
              </h3>
            </div>

            {/* Arrow with pulse effect */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="relative w-10 h-10 rounded-lg bg-slate-700/30 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                <svg
                  className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </button>
        ))}

        {filteredTeams.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400">Aucune équipe trouvée</p>
            <p className="text-slate-600 text-sm mt-1">Essayez un autre terme de recherche</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  )
}