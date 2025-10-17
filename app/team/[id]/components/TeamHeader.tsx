export default function TeamHeader({ teamInfo }: { teamInfo: any }) {
  return (
    <div className="relative mb-6">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
          {teamInfo.crest && (
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
              <div className="relative w-20 h-20 md:w-28 md:h-28 bg-slate-900/90 rounded-2xl p-3 md:p-4 border-2 border-slate-700/50 shadow-2xl">
                <img src={teamInfo.crest} alt={teamInfo.name} className="w-full h-full object-contain" />
              </div>
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text">
              {teamInfo.name}
            </h1>
            {teamInfo.area?.name && (
              <p className="text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                {teamInfo.area.flag && <img src={teamInfo.area.flag} alt={teamInfo.area.name} className="w-5 h-3 object-cover rounded" />}
                <span className="text-sm md:text-base">{teamInfo.area.name}</span>
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {teamInfo.founded && (
                <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <span className="text-slate-500 text-xs md:text-sm">Fondé</span>
                  <span className="text-indigo-400 font-bold text-xs md:text-sm">{teamInfo.founded}</span>
                </div>
              )}
              {teamInfo.venue && (
                <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-slate-300 text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{teamInfo.venue}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}