"use client"
import { useRouter } from "next/navigation"
import CompetitionSelector from "@/components/CompetitionSelector"
import SelectionLayout from "@/components/SelectionLayout"

export default function CompetitionPage() {
  const router = useRouter()

  const handleSelectCompetition = (competitionId: number) => {
    router.push(`/teams?competition=${competitionId}`)
  }

  return (
    <SelectionLayout
      title="Fanzone"
      subtitle="Ton club, ta passion, ton univers"
      sectionTitle="Commence ici"
      sectionSubtitle="Sélectionne ta compétition favorite"
      onBack={() => router.push('/')}
    >
      <CompetitionSelector onSelect={handleSelectCompetition} />
    </SelectionLayout>
  )
}