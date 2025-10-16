"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getTeamFullData } from "@/lib/api"
import MatchList from "../../../components/MatchList"
import { GroupedPlayersList } from "../../../components/PlayerCard"
import { useTeamStore } from "../../../store/useTeamStore"
import { calculateAge, FlagIcon } from "@/lib/utils"

export default function TeamPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = Number(params.id)

  const { 
    getTeamData, 
    setTeamData, 
    isCacheValid,
    clearCache,
    setTeamId 
  } = useTeamStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<"info" | "last" | "next" | "players">("info")

  // Récupérer les données du cache
  const cachedData = getTeamData(teamId)
  const teamInfo = cachedData?.info || null
  const lastMatches = cachedData?.lastMatches || []
  const nextMatches = cachedData?.nextMatches || []
  const players = cachedData?.players || []

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return

      // Définir l'équipe active
      setTeamId(teamId)

      // Vérifier si on a des données en cache valides
      if (isCacheValid(teamId)) {
        console.log('📦 Données chargées depuis le cache')
        setLoading(false)
        return
      }

      // Sinon, charger depuis l'API en UN SEUL APPEL
      console.log('🌐 Chargement depuis l\'API...')
      setLoading(true)
      setError(null)

      try {
        const data = await getTeamFullData(teamId)

        // Trier les derniers matchs du plus récent au plus ancien
        const sortedLastMatches = [...data.lastMatches]
          .filter((m) => m.utcDate)
          .sort(
            (a, b) =>
              new Date(b.utcDate!).getTime() - new Date(a.utcDate!).getTime()
          )

        // Sauvegarder TOUTES les données en une fois dans le cache
        setTeamData(teamId, {
          info: data.team,
          lastMatches: sortedLastMatches,
          nextMatches: data.nextMatches,
          players: data.players,
        })

        console.log('✅ Données sauvegardées en cache')
      } catch (err: any) {
        console.error('❌ Erreur chargement équipe :', err)
        setError("Impossible de récupérer les données de l'équipe")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [teamId, setTeamId, getTeamData, setTeamData, isCacheValid])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Chargement de votre équipe...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-semibold mb-2">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </main>
    )
  }

  if (!teamInfo) return null

  const tabs = [
    { id: "info", label: "Infos", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "last", label: "Derniers matchs", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: lastMatches.length },
    { id: "next", label: "Prochains matchs", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", count: nextMatches.length },
    { id: "players", label: "Effectif", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", count: players.length }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Back button + Clear cache button */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={() => {
              if (confirm("Voulez-vous réinitialiser le cache de cette équipe ?")) {
                localStorage.removeItem('fanzone-team-storage')
                clearCache()
                router.push('/')
              }
            }}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-amber-500/20 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-slate-300 group-hover:text-amber-400 transition-colors">Réinitialiser cache</span>
          </button>
        </div>

        {/* Team header */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Team crest with glow */}
              {teamInfo.crest && (
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700/50 shadow-2xl">
                    <img src={teamInfo.crest} alt={teamInfo.name} className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              {/* Team info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text">
                  {teamInfo.name}
                </h1>
                {teamInfo.area?.name && (
                  <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
                    {teamInfo.area.flag && <img src={teamInfo.area.flag} alt={teamInfo.area.name} className="w-6 h-4 object-cover rounded" />}
                    <span>{teamInfo.area.name}</span>
                  </p>
                )}
                
                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  {teamInfo.founded && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <span className="text-slate-500 text-sm">Fondé en</span>
                      <span className="text-indigo-400 font-bold">{teamInfo.founded}</span>
                    </div>
                  )}
                  {teamInfo.venue && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-slate-300 text-sm">{teamInfo.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-1 md:flex-none ${
                tab === t.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              <span className="hidden sm:inline">{t.label}</span>
              {t.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  tab === t.id ? "bg-white/20" : "bg-slate-700/50"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fadeIn">
          {tab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Coach card */}
              {teamInfo.coach && (
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">Entraîneur</h3>
                    </div>
                    <p className="text-2xl font-bold text-indigo-300 mb-2">{teamInfo.coach.name}</p>
                    {teamInfo.coach.nationality && 
                      <div className="flex items-center gap-2">
                        <FlagIcon nationality={teamInfo.coach.nationality} />
                          <span className="text-slate-400 truncate">{teamInfo.coach.nationality}</span>
                      </div>
                    }

                    {teamInfo.coach.dateOfBirth && (
                      <p className="text-slate-400 mb-1 mt-2">
                        📅 {new Date(teamInfo.coach.dateOfBirth).toLocaleDateString("fr-FR")}
                        {`  ( ${calculateAge(teamInfo.coach.dateOfBirth)} ans )`}
                        </p>
                    )}
                    {teamInfo.coach.contract?.start && teamInfo.coach.contract?.until && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <p className="text-sm text-slate-500">Contrat</p>
                        <p className="text-slate-300">{teamInfo.coach.contract.start} → {teamInfo.coach.contract.until}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Club details */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white">Informations</h3>
                  </div>
                  <div className="space-y-3">
                    {teamInfo.clubColors && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Couleurs</span>
                        <span className="text-white font-medium">{teamInfo.clubColors}</span>
                      </div>
                    )}
                    {teamInfo.website && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Site web</span>
                        <a
                          href={teamInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                        >
                          <span className="text-sm">Visiter</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Competitions */}
              {Array.isArray(teamInfo?.runningCompetitions) && teamInfo.runningCompetitions.length > 0 && (
                <div className="relative group md:col-span-2">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Compétitions en cours</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {teamInfo.runningCompetitions.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors"
                        >
                          {c.emblem && (
                            <img
                              src={c.emblem}
                              alt={c.name}
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <span className="text-slate-300 text-sm font-medium">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "last" && (
            <MatchList matches={lastMatches} teamId={teamId} />
          )}

          {tab === "next" && (
            <MatchList matches={nextMatches} teamId={teamId} />
          )}

          {tab === "players" && (
            <div>
              {players.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">Aucun joueur disponible</p>
                </div>
              ) : (
                <GroupedPlayersList players={players} />
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
    </main>
  )
}