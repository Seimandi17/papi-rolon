'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { TabsContent } from './TabsContent'
import { Tournament, Group, Team, MatchWithTeams, PlayerWithStats } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface TabsWrapperProps {
  tournament: Tournament
  groups: Group[]
  teams: Team[]
  matches: MatchWithTeams[]
  scheduledMatches: MatchWithTeams[]
  finishedMatches: MatchWithTeams[]
  players: PlayerWithStats[]
  playerStatsWithTeam: Array<{ player_id: string; team_id: string; yellow_cards: number; red_cards: number }>
  groupTeamsMap: Record<string, string[]>
}

const tabs = [
  { id: 'standings', label: 'Posiciones' },
  { id: 'fixture', label: 'Fixture' },
  { id: 'results', label: 'Resultados' },
  { id: 'scorers', label: 'Goleadores' },
  { id: 'cards', label: 'Amonestaciones' },
  { id: 'teams', label: 'Equipos' },
]

export function TabsWrapper(props: TabsWrapperProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)
  const [isRefreshing, setIsRefreshing] = useState(false)

  function handleRefresh() {
    setIsRefreshing(true)
    router.refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between border-b border-gray-200 mb-4">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-4"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
      <div className="mt-4">
        <TabsContent activeTab={activeTab} {...props} />
      </div>
    </div>
  )
}


