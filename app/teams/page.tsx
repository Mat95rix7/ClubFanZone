"use client"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import TeamSelector from "@/components/TeamSelector"
import SelectionLayout from "@/components/SelectionLayout"

function TeamsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const competitionIdParam = searchParams.get('competition')
  const competitionId = Number(competitionIdParam)
  
  const handleSelectTeam = (teamId: number) => {
    router.push(`/team/${teamId}`)
  }

  return (
    <SelectionLayout
      title="Fanzone"
      subtitle="Ton club, ta passion, ton univers"
      sectionTitle="Presque là !"
      sectionSubtitle="Choisis ton équipe de cœur"
      onBack={() => router.push('/competitions')}
    >
      <TeamSelector 
        competitionId={competitionId} 
        onSelect={handleSelectTeam} 
      />
    </SelectionLayout>
  )
}

export default function TeamsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
      <TeamsContent />
    </Suspense>
  )
}