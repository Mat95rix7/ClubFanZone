"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { GroupedPlayersList } from "@/components/PlayerCard"
import { useTeamStore } from "@/store/useTeamStore"
import { TabConfig, CompetitionSubTab, MainTab } from "@/types"
import useTeamData from "@/app/team/[id]/hooks/useTeamData"
import LoadingScreen from "@/app/team/[id]/components/LoadingScreen"
import ErrorScreen from "@/app/team/[id]/components/ErrorScreen"
import BackgroundElements from "@/app/team/[id]/components/BackgroundElements"
import HeaderActions from "@/app/team/[id]/components/HeaderActions"
import TeamHeader from "@/app/team/[id]/components/TeamHeader"
import CompetitionsTab from "@/app/team/[id]/components/CompetitionsTab"
import TabNavigation from "@/app/team/[id]/components/TabNavigation"
import EmptyState from "@/app/team/[id]/components/EmptyState"
import InfoTab from "@/app/team/[id]/components/InfoTab"

function SquadTab({ players, league }: { players: any[]; league: number }) {
  if (players.length === 0) {
    return (
      <EmptyState
        icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        message="Aucun joueur disponible"
      />
    )
  }

  return <GroupedPlayersList players={players} league={league} />
}


// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

export default function TeamPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = Number(params.id)
  const { clearCache } = useTeamStore()

  const { teamInfo, lastMatches, nextMatches, players, loading, error } = useTeamData(teamId)
  const [mainTab, setMainTab] = useState<MainTab>("info")
  const [selectedCompetition, setSelectedCompetition] = useState<number | "all">("all")
  const [competitionTab, setCompetitionTab] = useState<CompetitionSubTab>("last")

  const firstCompetitionId = teamInfo?.runningCompetitions?.[0]?.id

  useEffect(() => {
    
    

    if (firstCompetitionId && !selectedCompetition) {
        setSelectedCompetition(firstCompetitionId)
    }
    }, [teamInfo, selectedCompetition])


  const handleReset = () => {
    if (confirm("Voulez-vous réinitialiser le cache de cette équipe ?")) {
      localStorage.removeItem('fanzone-team-storage')
      clearCache()
      router.push('/')
    }
  }

  if (loading) return <LoadingScreen />
  if (error || !teamInfo) return <ErrorScreen error={error || "Équipe introuvable"} onBack={() => router.push("/")} />

  const mainTabs: TabConfig[] = [
    { id: "info", label: "Infos", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "squad", label: "Effectif", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", count: players.length },
    { id: "palmares", label: "Palmarès", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    { id: "competitions", label: "Compétitions", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", count: teamInfo.runningCompetitions?.length || 0 }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      <BackgroundElements />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
        <HeaderActions onBack={() => router.push("/")} onReset={handleReset} />
        <TeamHeader teamInfo={teamInfo} />
        <TabNavigation tabs={mainTabs} activeTab={mainTab} onTabChange={(tab) => setMainTab(tab as MainTab)} />

        <div className="animate-fadeIn">
          {mainTab === "info" && <InfoTab teamInfo={teamInfo} />}
          {mainTab === "squad" && <SquadTab players={players} league={firstCompetitionId} />}
          {mainTab === "palmares" && (
            <EmptyState
              icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              message="Palmarès à venir"
              subtitle="Cette fonctionnalité sera bientôt disponible"
            />
          )}
          {mainTab === "competitions" && (
            <CompetitionsTab
              teamInfo={teamInfo}
              teamId={teamId}
              lastMatches={lastMatches}
              nextMatches={nextMatches}
              selectedCompetition={selectedCompetition}
              onCompetitionChange={setSelectedCompetition}
              competitionTab={competitionTab}
              onCompetitionTabChange={setCompetitionTab}
            />
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