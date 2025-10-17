export default function HeaderActions({ onBack, onReset }: { onBack: () => void; onReset: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
      >
        <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-slate-300 group-hover:text-white transition-colors hidden sm:inline">Retour</span>
      </button>

      <button
        onClick={onReset}
        className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-amber-500/20 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300"
      >
        <svg className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-slate-300 group-hover:text-amber-400 transition-colors hidden sm:inline">Réinitialiser</span>
      </button>
    </div>
  )
}