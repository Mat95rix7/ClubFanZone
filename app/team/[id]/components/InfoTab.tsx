import { calculateAge, FlagIcon } from "@/lib/utils";
import InfoCard from "./InfoCard";

export default function InfoTab({ teamInfo }: { teamInfo: any }) {
  return (
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
  )
}