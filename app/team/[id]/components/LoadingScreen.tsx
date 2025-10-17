export default function LoadingScreen() {
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