'use client'

import { StandingsSection } from './StandingsSection'
import { MatchCard } from '@/components/MatchCard'
import { ScorersTable } from '@/components/ScorersTable'
import { CardsTable } from '@/components/CardsTable'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tournament, Group, Team, MatchWithTeams, PlayerWithStats } from '@/lib/types'

interface TabsContentProps {
  activeTab: string
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

export function TabsContent({
  activeTab,
  tournament,
  groups,
  teams,
  matches,
  scheduledMatches,
  finishedMatches,
  players,
  playerStatsWithTeam,
  groupTeamsMap,
}: TabsContentProps) {
  if (activeTab === 'standings') {
    return (
      <StandingsSection
        tournament={tournament}
        groups={groups}
        teams={teams}
        matches={matches}
        playerStats={playerStatsWithTeam}
        groupTeamsMap={groupTeamsMap}
      />
    )
  }

  if (activeTab === 'fixture') {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Próximos Partidos</CardTitle>
          </CardHeader>
          {scheduledMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay partidos programados</p>
          ) : (
            scheduledMatches.map((match) => <MatchCard key={match.id} match={match} />)
          )}
        </Card>
      </div>
    )
  }

  if (activeTab === 'results') {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          {finishedMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay resultados disponibles</p>
          ) : (
            finishedMatches
              .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
              .map((match) => <MatchCard key={match.id} match={match} />)
          )}
        </Card>
      </div>
    )
  }

  if (activeTab === 'scorers') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Goleadores</CardTitle>
        </CardHeader>
        <ScorersTable players={players} />
      </Card>
    )
  }

  if (activeTab === 'cards') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tarjetas Amarillas</CardTitle>
          </CardHeader>
          <CardsTable players={players} type="yellow" />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tarjetas Rojas</CardTitle>
          </CardHeader>
          <CardsTable players={players} type="red" />
        </Card>
      </div>
    )
  }

  if (activeTab === 'teams') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => {
          const teamPlayers = players.filter((p) => p.team_id === team.id)
          const teamMatches = matches.filter(
            (m) => m.status === 'finished' && (m.home_team_id === team.id || m.away_team_id === team.id)
          )
          const teamStats = playerStatsWithTeam.filter((ps) =>
            teamPlayers.some((p) => p.id === ps.player_id)
          )

          return (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Jugadores:</span> {teamPlayers.length}
                </p>
                <p>
                  <span className="font-medium">Partidos:</span> {teamMatches.length}
                </p>
                <p>
                  <span className="font-medium">Goles:</span>{' '}
                  {teamPlayers.reduce((sum, p) => sum + (p.stats?.goals || 0), 0)}
                </p>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return null
}

