import { calculateStandings } from '@/lib/calculations'
import { Group, Team, Match, Tournament } from '@/lib/types'
import { StandingsTable } from '@/components/StandingsTable'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

interface StandingsSectionProps {
  tournament: Tournament
  groups: Group[]
  teams: Team[]
  matches: Match[]
  playerStats: Array<{ player_id: string; team_id: string; yellow_cards: number; red_cards: number }>
  groupTeamsMap: Record<string, string[]>
}

export function StandingsSection({
  tournament,
  groups,
  teams,
  matches,
  playerStats,
  groupTeamsMap,
}: StandingsSectionProps) {
  if (groups.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No hay grupos configurados</p>
      </Card>
    )
  }

  const standingsData = groups.map((group) => {
    const groupTeamIds = groupTeamsMap[group.id] || []
    const groupTeams = teams.filter((t) => groupTeamIds.includes(t.id))
    const groupMatches = matches.filter((m) => m.group_id === group.id)
    const standings = calculateStandings(
      groupTeams,
      groupMatches,
      playerStats,
      tournament.points_win,
      tournament.points_draw,
      tournament.points_loss
    )

    return { group, standings }
  })

  return (
    <div>
      {standingsData.map(({ group, standings }) => (
        <div key={group.id} className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Grupo {group.name}</CardTitle>
            </CardHeader>
            <StandingsTable standings={standings} />
          </Card>
        </div>
      ))}
    </div>
  )
}

