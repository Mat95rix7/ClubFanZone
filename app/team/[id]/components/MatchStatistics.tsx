"use client"

interface MatchStatisticsProps {
  statistics: {
    team: {
      id: number
      name: string
    }
    statistics: Array<{
      type: string
      value: number
    }>
  }[]
}

export default function MatchStatistics({ statistics }: MatchStatisticsProps) {
  if (!statistics || statistics.length < 2) {
    return null
  }

  const homeStats = statistics[0]
  const awayStats = statistics[1]

  const getStatLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'ball_possession': 'Possession',
      'total_shots': 'Tirs',
      'shots_on_goal': 'Tirs cadrés',
      'shots_off_goal': 'Tirs non cadrés',
      'blocked_shots': 'Tirs bloqués',
      'corner_kicks': 'Corners',
      'offsides': 'Hors-jeux',
      'fouls': 'Fautes',
      'yellow_cards': 'Cartons jaunes',
      'red_cards': 'Cartons rouges',
      'goalkeeper_saves': 'Arrêts du gardien',
      'passes': 'Passes',
      'passes_accurate': 'Passes réussies'
    }
    return labels[type] || type
  }

  const getStatIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'ball_possession': '⚽',
      'total_shots': '🎯',
      'shots_on_goal': '🎯',
      'corner_kicks': '🚩',
      'fouls': '⚠️',
      'yellow_cards': '🟨',
      'red_cards': '🟥',
      'goalkeeper_saves': '🧤'
    }
    return icons[type] || '📊'
  }

  // Combiner les stats des deux équipes
  const combinedStats = homeStats.statistics.map((homeStat, index) => {
    const awayStat = awayStats.statistics[index]
    return {
      type: homeStat.type,
      homeValue: homeStat.value,
      awayValue: awayStat.value
    }
  })

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
      <h4 className="text-slate-300 font-semibold text-sm flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Statistiques en direct
      </h4>

      <div className="space-y-3">
        {combinedStats.map((stat, index) => {
          const total = stat.homeValue + stat.awayValue
          const homePercentage = total > 0 ? (stat.homeValue / total) * 100 : 50
          const awayPercentage = total > 0 ? (stat.awayValue / total) * 100 : 50

          return (
            <div key={index} className="space-y-1.5">
              {/* Label et valeurs */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">
                  {stat.homeValue}
                </span>
                <span className="text-slate-400 flex items-center gap-1.5">
                  <span className="text-lg">{getStatIcon(stat.type)}</span>
                  {getStatLabel(stat.type)}
                </span>
                <span className="text-slate-200 font-medium">
                  {stat.awayValue}
                </span>
              </div>

              {/* Barre de progression */}
              <div className="flex items-center gap-1 h-2">
                {/* Barre domicile */}
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-500"
                  style={{ width: `${homePercentage}%` }}
                />
                {/* Barre extérieur */}
                <div 
                  className="h-full bg-gradient-to-l from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${awayPercentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}