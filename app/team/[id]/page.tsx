"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getTeamFullData } from "@/lib/api"
import MatchList from "../../../components/MatchList"
import { GroupedPlayersList } from "../../../components/PlayerCard"
import { useTeamStore } from "../../../store/useTeamStore"
import { calculateAge, FlagIcon } from "@/lib/utils"
import MatchCard from "@/components/MatchCard"

type MainTab = "info" | "squad" | "palmares" | "competitions"
type CompetitionSubTab = "last" | "next" | "standings"

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
  const [mainTab, setMainTab] = useState<MainTab>("info")
  const [selectedCompetition, setSelectedCompetition] = useState<number | "all">("all")
  const [competitionTab, setCompetitionTab] = useState<CompetitionSubTab>("last")

  const cachedData = getTeamData(teamId)
  const teamInfo = cachedData?.info || null
  const lastMatches = cachedData?.lastMatches || []
  const nextMatches = cachedData?.nextMatches || []
  const players = cachedData?.players || []

  useEffect(() => {
    const fetchData = async () => {
      if (!teamId) return

      setTeamId(teamId)

      if (isCacheValid(teamId)) {
        console.log('📦 Données chargées depuis le cache')
        setLoading(false)
        return
      }

      console.log('🌐 Chargement depuis l\'API...')
      setLoading(true)
      setError(null)

      try {
        const data = await getTeamFullData(teamId)

        const sortedLastMatches = [...data.lastMatches]
          .filter((m) => m.utcDate)
          .sort((a, b) => new Date(b.utcDate!).getTime() - new Date(a.utcDate!).getTime())

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

  // Initialiser la compétition sélectionnée
  useEffect(() => {
    if (teamInfo?.runningCompetitions && teamInfo.runningCompetitions.length > 0 && !selectedCompetition) {
      setSelectedCompetition(teamInfo.runningCompetitions[0].id)
    }
  }, [teamInfo, selectedCompetition])

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

  if (error || !teamInfo) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 text-lg font-semibold mb-2">{error || "Équipe introuvable"}</p>
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

  const mainTabs = [
    { id: "info", label: "Infos", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "squad", label: "Effectif", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", count: players.length },
    { id: "palmares", label: "Palmarès", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { id: "competitions", label: "Compétitions", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", count: teamInfo.runningCompetitions?.length || 0 }
  ]

  const competitionTabs = [
    { id: "last", label: "Derniers matchs", count: lastMatches.length },
    { id: "next", label: "Prochains matchs", count: nextMatches.length },
    { id: "standings", label: "Classement" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-slate-300 group-hover:text-white transition-colors hidden sm:inline">Retour</span>
          </button>

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
            <span className="text-slate-300 group-hover:text-amber-400 transition-colors hidden sm:inline">Réinitialiser</span>
          </button>
        </div>

        {/* Team header */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-slate-700/50">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              {teamInfo.crest && (
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
                  <div className="relative w-20 h-20 md:w-28 md:h-28 bg-slate-900/90 rounded-2xl p-3 md:p-4 border-2 border-slate-700/50 shadow-2xl">
                    <img src={teamInfo.crest} alt={teamInfo.name} className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl md:text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text">
                  {teamInfo.name}
                </h1>
                {teamInfo.area?.name && (
                  <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    {teamInfo.area.flag && <img src={teamInfo.area.flag} alt={teamInfo.area.name} className="w-5 h-3 object-cover rounded" />}
                    <span className="text-sm md:text-base">{teamInfo.area.name}</span>
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                  {teamInfo.founded && (
                    <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <span className="text-slate-500 text-xs md:text-sm">Fondé</span>
                      <span className="text-indigo-400 font-bold text-xs md:text-sm">{teamInfo.founded}</span>
                    </div>
                  )}
                  {teamInfo.venue && (
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-slate-300 text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{teamInfo.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main tabs */}
        <div className="flex gap-2 mb-6 p-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-x-auto">
          {mainTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id as MainTab)}
              className={`relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                mainTab === t.id
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              <span className="text-xs md:text-sm">{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-bold ${
                  mainTab === t.id ? "bg-white/20" : "bg-slate-700/50"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="animate-fadeIn">
          {/* Info Tab */}
          {mainTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {teamInfo.coach && (
                <InfoCard
                  title="Entraîneur"
                  icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  gradient="from-indigo-500 to-purple-500"
                >
                  <p className="text-xl md:text-2xl font-bold text-indigo-300 mb-2">{teamInfo.coach.name}</p>
                  {teamInfo.coach.nationality && 
                    <div className="flex items-center gap-2 mb-2">
                      <FlagIcon nationality={teamInfo.coach.nationality} />
                      <span className="text-slate-400 text-sm">{teamInfo.coach.nationality}</span>
                    </div>
                  }
                  {teamInfo.coach.dateOfBirth && (
                    <p className="text-slate-400 text-sm mb-1">
                      📅 {new Date(teamInfo.coach.dateOfBirth).toLocaleDateString("fr-FR")}
                      {` (${calculateAge(teamInfo.coach.dateOfBirth)} ans)`}
                    </p>
                  )}
                  {teamInfo.coach.contract?.start && teamInfo.coach.contract?.until && (
                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500">Contrat</p>
                      <p className="text-slate-300 text-sm">{teamInfo.coach.contract.start} → {teamInfo.coach.contract.until}</p>
                    </div>
                  )}
                </InfoCard>
              )}

              <InfoCard
                title="Informations club"
                icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                gradient="from-purple-500 to-pink-500"
              >
                <div className="space-y-3">
                  {teamInfo.clubColors && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Couleurs</span>
                      <span className="text-white font-medium text-sm">{teamInfo.clubColors}</span>
                    </div>
                  )}
                  {teamInfo.website && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-sm">Site web</span>
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
              </InfoCard>
            </div>
          )}

          {/* Squad Tab */}
          {mainTab === "squad" && (
            <div>
              {players.length === 0 ? (
                <EmptyState
                  icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  message="Aucun joueur disponible"
                />
              ) : (
                <GroupedPlayersList players={players} />
              )}
            </div>
          )}

          {/* Palmares Tab */}
          {mainTab === "palmares" && (
            <EmptyState
              icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              message="Palmarès à venir"
              subtitle="Cette fonctionnalité sera bientôt disponible"
            />
          )}

          {/* Competitions Tab */}
{mainTab === "competitions" && (
  <div className="space-y-4">
    {!teamInfo.runningCompetitions || teamInfo.runningCompetitions.length === 0 ? (
      <EmptyState
        icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        message="Aucune compétition en cours"
      />
    ) : (
      <>
        {/* Sélecteur de compétition principal avec "Toutes les compétitions" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedCompetition("all")}
            className={`group relative flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
              selectedCompetition === "all"
                ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                : "bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60"
            }`}
          >
            <span className="text-sm md:text-base font-medium">Toutes les compétitions</span>
          </button>

          {teamInfo.runningCompetitions.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCompetition(c.id)}
              className={`group relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${
                selectedCompetition === c.id
                  ? "bg-indigo-500/20 border-indigo-500/50"
                  : "bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/60"
              }`}
            >
              {c.emblem && (
                <img
                  src={c.emblem}
                  alt={c.name}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0"
                />
              )}
              <span
                className={`text-sm md:text-base font-medium flex-1 text-left ${
                  selectedCompetition === c.id ? "text-indigo-300" : "text-slate-300"
                }`}
              >
                {c.name}
              </span>
              {selectedCompetition === c.id && (
                <svg
                  className="w-5 h-5 text-indigo-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Contenu de la compétition sélectionnée */}
        {selectedCompetition && (() => {
          // Filtrage selon la compétition sélectionnée
          const filteredLast =
            selectedCompetition === "all"
              ? lastMatches
              : lastMatches.filter((m) => m.competition?.id === selectedCompetition)

          const filteredNext =
            selectedCompetition === "all"
              ? nextMatches
              : nextMatches.filter((m) => m.competition?.id === selectedCompetition)

          // Trouver le prochain match global (peu importe la compétition)
          const allMatches = [...lastMatches, ...nextMatches]
          const upcomingMatches = allMatches
            .filter((m) => new Date(m.utcDate) > new Date())
            .sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

          const nextMatch = upcomingMatches[0] || null

          // Supprimer le prochain match des listes pour éviter la duplication
          const filteredLastWithoutNext = filteredLast.filter((m) => m.id !== nextMatch?.id)
          const filteredNextWithoutNext = filteredNext.filter((m) => m.id !== nextMatch?.id)

          // Mise à jour dynamique des compteurs
          const competitionTabs = [
            { id: "last", label: "Derniers matchs", count: filteredLastWithoutNext.length },
            { id: "next", label: "Prochains matchs", count: filteredNextWithoutNext.length },
            { id: "standings", label: "Classement" },
          ]

          return (
            <>
              {/* Prochain match affiché en premier */}
              {nextMatch && (
                <div className="mb-4">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">Prochain match</h3>
                  <MatchCard match={nextMatch} teamId={teamId} />
                </div>
              )}

              {/* Sous-onglets (last / next / standings) */}
              <div className="flex gap-2 p-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-x-auto">
                {competitionTabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setCompetitionTab(t.id as CompetitionSubTab)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      competitionTab === t.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-xs md:text-sm">{t.label}</span>
                    {t.count !== undefined && t.count > 0 && (
                      <span
                        className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-bold ${
                          competitionTab === t.id ? "bg-white/20" : "bg-slate-700/50"
                        }`}
                      >
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Contenu selon sous-onglet */}
              <div className="animate-fadeIn">
                {competitionTab === "last" && (
                  filteredLastWithoutNext.length > 0 ? (
                    <MatchList matches={filteredLastWithoutNext} teamId={teamId} />
                  ) : (
                    <EmptyState
                      icon="M12 4v16m8-8H4"
                      message="Aucun match récent pour cette compétition"
                    />
                  )
                )}

                {competitionTab === "next" && (
                  filteredNextWithoutNext.length > 0 ? (
                    <MatchList matches={filteredNextWithoutNext} teamId={teamId} />
                  ) : (
                    <EmptyState
                      icon="M12 4v16m8-8H4"
                      message="Aucun match prévu pour cette compétition"
                    />
                  )
                )}

                {competitionTab === "standings" && (
                  <EmptyState
                    icon="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    message="Classement à venir"
                    subtitle="Cette fonctionnalité sera bientôt disponible"
                  />
                )}
              </div>
            </>
          )
        })()}
      </>
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
      `}</style>
    </main>
  )
}

// Helper Components
function InfoCard({ title, icon, gradient, children }: { 
  title: string
  icon: string
  gradient: string
  children: React.ReactNode 
}) {
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-20 flex items-center justify-center`}>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <h3 className="text-base md:text-xl font-bold text-white">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  message,
  subtitle,
}: {
  icon: string
  message: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-slate-800/40 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
        <svg
          className="w-10 h-10 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>

      <p className="text-slate-300 text-lg font-semibold mb-2">{message}</p>

      {subtitle && (
        <p className="text-slate-500 text-sm max-w-md">{subtitle}</p>
      )}
    </div>
  )
}
