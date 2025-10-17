export default function EmptyState({ icon, message, subtitle }: { icon: string; message: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-slate-800/40 rounded-2xl flex items-center justify-center mb-6 border border-slate-700/50">
        <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <p className="text-slate-300 text-lg font-semibold mb-2">{message}</p>
      {subtitle && <p className="text-slate-500 text-sm max-w-md">{subtitle}</p>}
    </div>
  )
}