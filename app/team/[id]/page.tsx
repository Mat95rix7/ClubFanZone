// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Team, Match, Player, getTeamInfo, getLastMatches, getNextMatches, getTeamPlayers } from "../../../lib/api"
// import PlayerCard from "../../../components/PlayerCard"
// import MatchList from "@/components/MatchList"
// import { useTeamStore } from "@/store/useTeamStore"

// export default function TeamPage() {
//   const params = useParams()
//   const router = useRouter()
//   const teamId = Number(params.id)

//   const [teamInfo, setTeamInfo] = useState<Team | null>(null)
//   const [lastMatches, setLastMatches] = useState<Match[]>([])
//   const [nextMatches, setNextMatches] = useState<Match[]>([])
//   const [players, setPlayers] = useState<Player[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [tab, setTab] = useState<"info" | "last" | "next" | "players">("info")
//   const clearTeam = useTeamStore((state) => state.clearTeam)

//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const info = await getTeamInfo(teamId)
//       const last = await getLastMatches(teamId)
//       const nextM = await getNextMatches(teamId)
//       const squad = await getTeamPlayers(teamId)

//       // Trier les derniers matchs : du plus récent au plus ancien
//       const sortedLast = last.sort((a, b) => {
//         if (!a.utcDate || !b.utcDate) return 0
//         return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime()
//       })

//       // Trier les prochains matchs : du plus proche au plus lointain
//       const sortedNext = nextM.sort((a, b) => {
//         if (!a.utcDate || !b.utcDate) return 0
//         return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
//       })

//       setTeamInfo(info)
//       setLastMatches(sortedLast)
//       setNextMatches(sortedNext)
//       setPlayers(squad)
//     } catch (err: any) {
//       console.error(err)
//       setError("Impossible de récupérer les données")
//     } finally {
//       setLoading(false)
//     }
//   }
//   fetchData()
// }, [teamId])


//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
//         <div className="absolute inset-0">
//           <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
//         </div>
//         <div className="relative z-10 flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <div className="w-20 h-20 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
//             <p className="text-slate-400 text-lg">Chargement de votre équipe...</p>
//           </div>
//         </div>
//       </main>
//     )
//   }

//   if (error) {
//     return (
//       <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <p className="text-red-400 text-lg font-semibold mb-2">{error}</p>
//           <button
//             onClick={() => router.push("/")}
//             className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
//           >
//             Retour à l'accueil
//           </button>
//         </div>
//       </main>
//     )
//   }

//   if (!teamInfo) return null

//   const tabs = [
//     { id: "info", label: "Infos", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
//     { id: "last", label: "Résultats", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", count: lastMatches.length },
//     { id: "next", label: "Calendrier", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", count: nextMatches.length },
//     { id: "players", label: "Effectif", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", count: players.length }
//   ]

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
//       {/* Animated background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
//       </div>

//       {/* Grid pattern */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
//         {/* Back button */}
//         <button
//           onClick={() => router.push("/")}
//           className="group mb-6 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
//         >
//           <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="text-slate-300 group-hover:text-white transition-colors">Retour</span>
//         </button>
//         <button
//           onClick={() => {
//             clearTeam()
//             router.push("/")
//           }}
//           className="group flex items-center gap-2 px-4 py-2 bg-red-600/50 hover:bg-red-600/80 text-white rounded-xl border border-red-500/50 transition-all duration-300"
//         >
//           Effacer l'équipe
//         </button>

//         {/* Team header */}
//         <div className="relative mb-8">
//           <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
//           <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50">
//             <div className="flex flex-col md:flex-row items-center gap-6">
//               {/* Team crest with glow */}
//               {teamInfo.crest && (
//                 <div className="relative flex-shrink-0">
//                   <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
//                   <div className="relative w-32 h-32 md:w-40 md:h-40 bg-slate-900/90 rounded-2xl p-4 border-2 border-slate-700/50 shadow-2xl">
//                     <img src={teamInfo.crest} alt={teamInfo.name} className="w-full h-full object-contain" />
//                   </div>
//                 </div>
//               )}

//               {/* Team info */}
//               <div className="flex-1 text-center md:text-left">
//                 <h1 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text">
//                   {teamInfo.name}
//                 </h1>
//                 {teamInfo.area?.name && (
//                   <p className="text-slate-400 text-lg flex items-center justify-center md:justify-start gap-2">
//                     {teamInfo.area.flag && <img src={teamInfo.area.flag} alt={teamInfo.area.name} className="w-6 h-4 object-cover rounded" />}
//                     <span>{teamInfo.area.name}</span>
//                   </p>
//                 )}
                
//                 {/* Quick stats */}
//                 <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
//                   {teamInfo.founded && (
//                     <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
//                       <span className="text-slate-500 text-sm">Fondé en</span>
//                       <span className="text-indigo-400 font-bold">{teamInfo.founded}</span>
//                     </div>
//                   )}
//                   {teamInfo.venue && (
//                     <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
//                       <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       <span className="text-slate-300 text-sm">{teamInfo.venue}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex flex-wrap gap-2 mb-6 p-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50">
//           {tabs.map((t) => (
//             <button
//               key={t.id}
//               onClick={() => setTab(t.id as any)}
//               className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-1 md:flex-none ${
//                 tab === t.id
//                   ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
//                   : "text-slate-400 hover:text-white hover:bg-slate-800/50"
//               }`}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
//               </svg>
//               <span className="hidden sm:inline">{t.label}</span>
//               {t.count !== undefined && (
//                 <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
//                   tab === t.id ? "bg-white/20" : "bg-slate-700/50"
//                 }`}>
//                   {t.count}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Tab content */}
//         <div className="animate-fadeIn">
//           {tab === "info" && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Coach card */}
//               {teamInfo.coach && (
//                 <div className="relative group">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
//                   <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
//                     <div className="flex items-center gap-2 mb-4">
//                       <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
//                         <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       </div>
//                       <h3 className="text-xl font-bold text-white">Entraîneur</h3>
//                     </div>
//                     <p className="text-2xl font-bold text-indigo-300 mb-2">{teamInfo.coach.name}</p>
//                     {teamInfo.coach.nationality && <p className="text-slate-400 mb-1">🌍 {teamInfo.coach.nationality}</p>}
//                     {teamInfo.coach.dateOfBirth && (
//                       <p className="text-slate-400 mb-1">📅 {new Date(teamInfo.coach.dateOfBirth).toLocaleDateString("fr-FR")}</p>
//                     )}
//                     {teamInfo.coach.contract?.start && teamInfo.coach.contract?.until && (
//                       <div className="mt-3 pt-3 border-t border-slate-700/50">
//                         <p className="text-sm text-slate-500">Contrat</p>
//                         <p className="text-slate-300">{teamInfo.coach.contract.start} → {teamInfo.coach.contract.until}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Club details */}
//               <div className="relative group">
//                 <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
//                 <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
//                   <div className="flex items-center gap-2 mb-4">
//                     <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
//                       <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     </div>
//                     <h3 className="text-xl font-bold text-white">Informations</h3>
//                   </div>
//                   <div className="space-y-3">
//                     {teamInfo.clubColors && (
//                       <div className="flex justify-between">
//                         <span className="text-slate-400">Couleurs</span>
//                         <span className="text-white font-medium">{teamInfo.clubColors}</span>
//                       </div>
//                     )}
//                     {teamInfo.website && (
//                       <div className="flex justify-between items-center">
//                         <span className="text-slate-400">Site web</span>
//                         <a
//                           href={teamInfo.website}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
//                         >
//                           <span className="text-sm">Visiter</span>
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                           </svg>
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Competitions */}
//               {teamInfo.runningCompetitions?.length > 0 && (
//                 <div className="relative group md:col-span-2">
//                   <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
//                   <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
//                     <div className="flex items-center gap-2 mb-4">
//                       <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
//                         <span className="text-2xl">🏆</span>
//                       </div>
//                       <h3 className="text-xl font-bold text-white">Compétitions en cours</h3>
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                       {teamInfo.runningCompetitions.map((c: any) => (
//                         <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors">
//                           {c.emblem && <img src={c.emblem} alt={c.name} className="w-10 h-10 object-contain" />}
//                           <span className="text-slate-300 text-sm font-medium">{c.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {tab === "last" && (
//             <div className="space-y-3">
//               {lastMatches.length === 0 ? (
//                 <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50">
//                   <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-400">Aucun match récent disponible</p>
//                 </div>
//               ) : (
//                 // lastMatches.map((m) => <MatchCard key={m.id} match={m} teamId={teamId}/>)
//                 <MatchList matches={lastMatches} teamId={teamId} />
//               )}
//             </div>
//           )}

//           {tab === "next" && (
//             <div className="space-y-3">
//               {nextMatches.length === 0 ? (
//                 <div className="text-center py-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50">
//                   <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-400">Aucun match prévu</p>
//                 </div>
//               ) : (
//                 // nextMatches.map((m) => <MatchCard key={m.id} match={m} teamId={teamId} />)
//                 <MatchList matches={nextMatches} teamId={teamId} />
//               )}
//             </div>
//           )}

//           {tab === "players" && (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
//               {players.length === 0 ? (
//                 <div className="col-span-full text-center py-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50">
//                   <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-400">Aucun joueur disponible</p>
//                 </div>
//               ) : (
//                 players.map((p) => <PlayerCard key={p.id} player={p} />)
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
//         .delay-700 { animation-delay: 700ms; }
//       `}</style>
//     </main>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Team, Match, Player } from "@/types"
import { getTeamInfo, getLastMatches, getNextMatches, getTeamPlayers } from "@/lib/api"
import MatchList from "../../../components/MatchList"
import PlayerCard from "../../../components/PlayerCard"
import { useTeamStore } from "../../../store/useTeamStore"

export default function TeamPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = Number(params.id)

  const { getTeamCache, setTeamCache, isCacheValid } = useTeamStore()

  const [teamInfo, setTeamInfo] = useState<Team | null>(null)
  const [lastMatches, setLastMatches] = useState<Match[]>([])
  const [nextMatches, setNextMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<"info" | "last" | "next" | "players">("info")
  const [fromCache, setFromCache] = useState(false)

  const clearCurrentTeam = useTeamStore((state) => state.clearCurrentTeam)

  useEffect(() => {
    const fetchData = async () => {
      // Vérifier si on a des données en cache valides
      const cachedData = getTeamCache(teamId)

      if (cachedData && isCacheValid(teamId)) {
        console.log('📦 Chargement depuis le cache')
        setTeamInfo(cachedData.info)
        setLastMatches(cachedData.lastMatches)
        setNextMatches(cachedData.nextMatches)
        setPlayers(cachedData.players)
        setLoading(false)
        setFromCache(true)
        return
      }

      // Sinon, charger depuis l'API
      console.log('🌐 Chargement depuis l\'API')
      setFromCache(false)

      try {
        const [info, last, nextM, squad] = await Promise.all([
          getTeamInfo(teamId),
          getLastMatches(teamId),
          getNextMatches(teamId),
          getTeamPlayers(teamId),
        ])

        // ✅ Trier les derniers matchs du plus récent au plus ancien sans mutation
        const sortedLast = [...last]
          .filter((m) => m.utcDate)
          .sort(
            (a, b) =>
              new Date(b.utcDate!).getTime() - new Date(a.utcDate!).getTime()
          )

        setTeamInfo(info)
        setLastMatches(sortedLast)
        setNextMatches(nextM)
        setPlayers(squad)

        // Sauvegarder dans le cache
        setTeamCache(teamId, {
          info,
          lastMatches: sortedLast,
          nextMatches: nextM,
          players: squad,
        })

        console.log('✅ Données sauvegardées en cache')
      } catch (err: any) {
        console.error('❌ Erreur chargement équipe :', err)
        setError("Impossible de récupérer les données")
      } finally {
        setLoading(false)
      }
    }

    if (teamId) fetchData()
  }, [teamId, getTeamCache, setTeamCache, isCacheValid])

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
        {/* Back button + Cache indicator */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
          >
            <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-slate-300 group-hover:text-white transition-colors">Retour</span>
          </button>

          <button
            onClick={() => {
              if (confirm("Voulez-vous effacer l’équipe sélectionnée ?")) {
                clearCurrentTeam()
                router.push("/")
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all"
          >
            <span>Effacer</span>
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
                    {teamInfo.coach.nationality && <p className="text-slate-400 mb-1">🌍 {teamInfo.coach.nationality}</p>}
                    {teamInfo.coach.dateOfBirth && (
                      <p className="text-slate-400 mb-1">📅 {new Date(teamInfo.coach.dateOfBirth).toLocaleDateString("fr-FR")}</p>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {players.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800/50">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">Aucun joueur disponible</p>
                </div>
              ) : (
                players.map((p) => <PlayerCard key={p.id} player={p} />)
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