"use client"

import { useEffect, useState } from "react"
import { getCompetitions } from "../lib/api"
import { Competition } from "@/types"
import { Globe } from "lucide-react"

type Props = {
  onSelect: (competitionId: number) => void
}

export default function CompetitionSelector({ onSelect }: Props) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getCompetitions()
        setCompetitions(data)
      } catch (err) {
        console.error("Erreur récupération compétitions :", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompetitions()
  }, [])

  const filteredCompetitions = competitions.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse border border-slate-700/50"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
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
          placeholder="Rechercher une compétition..."
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
          {filteredCompetitions.length} compétition{filteredCompetitions.length > 1 ? 's' : ''} trouvée{filteredCompetitions.length > 1 ? 's' : ''}
        </span>
        {searchTerm && (
          <span className="text-indigo-400 font-medium">
            Recherche: "{searchTerm}"
          </span>
        )}
      </div>

      {/* Competitions grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredCompetitions.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="group relative flex items-center gap-4 p-4 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden text-left"
            style={{
              animation: `fadeInUp 0.4s ease-out ${idx * 0.05}s both`
            }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500"></div>

            {/* Left accent line */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>

            {/* Country flag */}
            {c.area?.flag ? (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden border-2 border-slate-700/50 group-hover:border-indigo-500/50 transition-colors duration-300 bg-slate-900/50">
                  <img
                    src={c.area.flag}
                    alt={c.area.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ):(
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center border-2 border-slate-700/50 group-hover:border-indigo-500/50 transition-colors duration-300 bg-slate-900/50 text-slate-400">
                  <Globe className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            )}

            {/* Competition info */}
            <div className="relative flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm md:text-base group-hover:text-indigo-300 transition-colors duration-300 line-clamp-2">
                {c.name}
              </h3>
              {c.area?.name && (
                <p className="text-slate-500 text-xs md:text-sm mt-0.5 group-hover:text-slate-400 transition-colors duration-300 truncate">
                  {c.area.name}
                </p>
              )}
            </div>

            {/* Competition emblem */}
            {c.emblem && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl overflow-hidden bg-slate-900/80 backdrop-blur-sm p-1.5 md:p-2 border border-slate-700/30 group-hover:border-purple-500/50 group-hover:scale-110 transition-all duration-300">
                  <img
                    src={c.emblem}
                    alt={c.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Arrow with pulse effect */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-700/30 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-slate-500 group-hover:text-indigo-400 transition-colors duration-300"
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

        {filteredCompetitions.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-slate-400">Aucune compétition trouvée</p>
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