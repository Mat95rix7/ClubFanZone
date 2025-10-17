export default function ErrorScreen({ error, onBack }: { error: string; onBack: () => void }) {
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
          onClick={onBack}
          className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </main>
  )
}