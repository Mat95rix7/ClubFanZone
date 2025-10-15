"use client"

import { useEffect, useState } from "react"
import { getCompetitions } from "../lib/api"
import { Competition } from "@/types"


type Props = {
  onSelect: (competitionId: number) => void
}

export default function CompetitionSelector({ onSelect }: Props) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700/50"
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {competitions.map((c, idx) => (
        <button
          key={c.id}
          onClick={() => onSelect(c.id)}
          className="group relative w-full flex items-center gap-4 p-5 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden"
          style={{
            animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`
          }}
        >
          {/* Glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500"></div>

          {/* Left shine effect */}
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Content */}
          <div className="relative flex items-center gap-4 flex-1 min-w-0">
            {/* Country flag */}
            {c.area?.flag && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-700/50 group-hover:border-indigo-500/50 transition-colors duration-300 bg-slate-900/50">
                  <img
                    src={c.area.flag}
                    alt={c.area.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Competition name */}
            <div className="flex-1 min-w-0 text-left">
              <h3 className="text-white font-semibold text-lg group-hover:text-indigo-300 transition-colors duration-300 truncate">
                {c.name}
              </h3>
              {c.area?.name && (
                <p className="text-slate-500 text-sm mt-0.5 group-hover:text-slate-400 transition-colors duration-300">
                  {c.area.name}
                </p>
              )}
            </div>

            {/* Competition emblem */}
            {c.emblem && (
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all duration-300"></div>
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900/80 backdrop-blur-sm p-2 border border-slate-700/30 group-hover:border-purple-500/50 group-hover:scale-110 transition-all duration-300">
                  <img
                    src={c.emblem}
                    alt={c.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="relative flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/30 group-hover:bg-indigo-500/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>
      ))}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}