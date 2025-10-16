'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect, use } from "react"

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <main className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        
        {/* Hero Section */}
        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Main title with glow effect */}
          <div className="mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-3xl opacity-60 animate-pulse"></div>
              <h1 className="relative text-7xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl mb-3">
                Fanzone
              </h1>
            </div>
          </div>

          {/* Football emoji with animation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-ping"></div>
              <span className="relative text-5xl md:text-6xl animate-bounce-slow inline-block">⚽</span>
            </div>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>

          {/* Subtitle */}
          <p className="text-slate-300 text-xl md:text-2xl font-light mb-3 tracking-wide">
            Ton club, ta passion, ton univers
          </p>
          
          <p className="text-slate-400 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Plonge dans l'univers de ton équipe favorite. Stats en direct, classements, et bien plus encore.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => router.push('/competitions')}
              className="group relative px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-lg font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/50"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <span className="relative flex items-center gap-3">
                Commencer l'aventure
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => router.push('/about')}
              className="px-8 py-4 rounded-2xl bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 text-slate-300 text-base font-semibold hover:bg-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105"
            >
              En savoir plus
            </button>
          </div>
        </div>

        {/* Features Cards - Compact version */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* Feature 1 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Stats en direct</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Suis les performances en temps réel.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-indigo-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-indigo-500/10 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Classements</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Consulte les classements européens.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-pink-500/50 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:via-indigo-500/5 group-hover:to-purple-500/10 transition-all duration-500"></div>
            
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-indigo-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Résultats instantanés</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Accède aux derniers résultats.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}