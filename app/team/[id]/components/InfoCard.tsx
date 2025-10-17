export default function InfoCard({ title, icon, gradient, children }: { 
  title: string
  icon: string
  gradient: string
  children: React.ReactNode 
}) {
  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-r ${gradient} bg-opacity-20 flex items-center justify-center`}>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <h3 className="text-base md:text-xl font-bold text-white">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  )
}