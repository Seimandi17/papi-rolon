import { getTournament, getTeams, getGroups, getMatches, getPlayers, getPlayerStats, getGroupTeams } from '@/lib/api'
import { TabsWrapper } from '@/app/components/TabsWrapper'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  const tournament = await getTournament()
  
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">PAPI FÚTBOL ROLÓN</h1>
          <p className="text-gray-600 mb-4">No hay torneo configurado aún.</p>
          <Link href="/admin" className="text-primary hover:underline">
            Ir a Admin para configurar
          </Link>
        </div>
      </div>
    )
  }

  const [teams, groups, matches, players, playerStats] = await Promise.all([
    getTeams(tournament.id),
    getGroups(tournament.id),
    getMatches(tournament.id),
    getPlayers(tournament.id),
    getPlayerStats(tournament.id),
  ])

  const finishedMatches = matches.filter((m) => m.status === 'finished')
  const scheduledMatches = matches.filter((m) => m.status === 'scheduled')

  // Preparar datos para cálculo de posiciones
  const playerStatsWithTeam = playerStats.map((ps) => {
    const player = players.find((p) => p.id === ps.player_id)
    return {
      player_id: ps.player_id,
      team_id: player?.team_id || '',
      yellow_cards: ps.yellow_cards,
      red_cards: ps.red_cards,
    }
  })

  // Cargar equipos por grupo
  const groupTeamsMap: Record<string, string[]> = {}
  for (const group of groups) {
    const teamIds = await getGroupTeams(group.id)
    groupTeamsMap[group.id] = teamIds
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{tournament.name}</h1>
              {tournament.edition && (
                <p className="text-sm text-gray-200">{tournament.edition}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <TabsWrapper
          tournament={tournament}
          groups={groups}
          teams={teams}
          matches={matches}
          scheduledMatches={scheduledMatches}
          finishedMatches={finishedMatches}
          players={players}
          playerStatsWithTeam={playerStatsWithTeam}
          groupTeamsMap={groupTeamsMap}
        />
      </main>

      {/* Footer */}
      <footer className="bg-accent text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>PAPI FÚTBOL ROLÓN © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

