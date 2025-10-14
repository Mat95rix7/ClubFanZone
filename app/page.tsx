"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CompetitionSelector from "../components/CompetitionSelector"
import TeamSelector from "../components/TeamSelector"
import { useTeamStore } from "../store/useTeamStore"

export default function HomePage() {
  const [competitionId, setCompetitionId] = useState<number | null>(null)
  const teamId = useTeamStore((s) => s.teamId)
  const router = useRouter()

  // Redirection automatique si l'équipe est déjà sélectionnée
  useEffect(() => {
    if (teamId) {
      router.push(`/team/${teamId}`)
    }
  }, [teamId, router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header avec animation */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-7xl md:text-8xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
                Fanzone
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-500"></div>
            <span className="text-6xl animate-bounce">⚽</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-500"></div>
          </div>
          <p className="text-slate-400 text-lg md:text-xl font-light tracking-wide">
            Ton club, ta passion, ton univers
          </p>
        </div>

        {/* Card principale avec glassmorphism */}
        <div className="w-full max-w-2xl">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
            
            {/* Card content */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-slate-700/50 shadow-2xl">
              {!competitionId ? (
                <div className="space-y-6 animate-slideUp">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Commence ici</h2>
                      <p className="text-slate-400 mt-1">Sélectionne ta compétition favorite</p>
                    </div>
                  </div>
                  <CompetitionSelector onSelect={setCompetitionId} />
                </div>
              ) : (
                <div className="space-y-6 animate-slideUp">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-12 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                      <div>
                        <h2 className="text-3xl font-bold text-white">Presque là !</h2>
                        <p className="text-slate-400 mt-1">Choisis ton équipe de cœur</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCompetitionId(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-all duration-300 border border-slate-700/50 hover:border-slate-600"
                    >
                      ← Retour
                    </button>
                  </div>
                  <TeamSelector competitionId={competitionId} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer subtle */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm font-light">
            Rejoins des millions de supporters passionnés
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </main>
  )
}