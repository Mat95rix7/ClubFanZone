import { TabConfig } from "@/types"

export default function TabNavigation({ tabs, activeTab, onTabChange }: { 
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (tab: string) => void 
}) {
  return (
    <div className="flex gap-2 mb-6 p-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className={`relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
            activeTab === t.id
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
          </svg>
          <span className="text-xs md:text-sm">{t.label}</span>
          {t.count !== undefined && t.count > 0 && (
            <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === t.id ? "bg-white/20" : "bg-slate-700/50"
            }`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
