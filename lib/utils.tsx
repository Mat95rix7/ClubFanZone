// 📁 src/utils/playerUtils.tsx
import React from "react"
import { countryCodeMap } from "@/lib/countrycodemap"

// === Icône de drapeau ===
export const FlagIcon = ({ nationality }: { nationality: string }) => {
  const code = countryCodeMap[nationality]
  if (!code) {
    return <span className="text-lg">🌍</span>
  }

  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      srcSet={`https://flagcdn.com/48x36/${code}.png 2x, https://flagcdn.com/72x54/${code}.png 3x`}
      width="24"
      height="18"
      alt={nationality}
      className="rounded shadow-sm"
    />
  )
}

// === Calcul de l'âge ===
export const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

// === Couleur par poste ===
export const getPositionColor = (position: string): string => {
  if (!position) return 'from-slate-600 to-slate-700'
  const pos = position.toLowerCase()
  if (pos.includes('goal')) return 'from-yellow-600 to-amber-600'
  if (pos.includes('back') || pos.includes('defence')) return 'from-blue-600 to-indigo-600'
  if (pos.includes('midfield')) return 'from-green-600 to-emerald-600'
  if (pos.includes('forward') || pos.includes('winger') || pos.includes('offence')) return 'from-red-600 to-rose-600'
  return 'from-slate-600 to-slate-700'
}

// === Catégorie de poste ===
export const getPositionCategory = (position: string): string => {
  if (!position) return 'Autres'
  const pos = position.toLowerCase()
  if (pos.includes('goal')) return 'Gardiens'
  if (pos.includes('back') || pos.includes('defence')) return 'Défenseurs'
  if (pos.includes('midfield')) return 'Milieux'
  if (pos.includes('forward') || pos.includes('winger') || pos.includes('offence')) return 'Attaquants'
  return 'Autres'
}