'use client'

import { useState } from 'react'
import { TabsContent } from './TabsContent'
import { Tournament, Group, Team, MatchWithTeams, PlayerWithStats } from '@/lib/types'

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
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
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
      </div>
      <div className="mt-4">
        <TabsContent activeTab={activeTab} {...props} />
      </div>
    </div>
  )
}


