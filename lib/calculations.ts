import { TeamStanding, Match, Team, PlayerStats } from './types'

/**
 * Calcula la tabla de posiciones para un grupo
 * Criterio de ordenamiento:
 * 1. Mayor PTS primero
 * 2. Si empatan: mayor DG primero
 * 3. Si sigue el empate: mayor GF primero
 * 4. Si sigue el empate: menor GC primero
 */
export function calculateStandings(
  teams: Team[],
  matches: Match[],
  playerStats: Array<{ player_id: string; team_id: string; yellow_cards: number; red_cards: number }>,
  pointsWin: number = 3,
  pointsDraw: number = 1,
  pointsLoss: number = 0
): TeamStanding[] {
  const standings: Map<string, TeamStanding> = new Map()

  // Inicializar estadísticas para cada equipo
  teams.forEach((team) => {
    standings.set(team.id, {
      team,
      PJ: 0,
      PG: 0,
      PE: 0,
      PP: 0,
      GF: 0,
      GC: 0,
      DG: 0,
      PTS: 0,
      TA: 0,
      TR: 0,
    })
  })

  // Procesar partidos finalizados
  matches
    .filter((m) => m.status === 'finished')
    .forEach((match) => {
      const homeStanding = standings.get(match.home_team_id)
      const awayStanding = standings.get(match.away_team_id)

      if (!homeStanding || !awayStanding) return

      // Actualizar partidos jugados
      homeStanding.PJ++
      awayStanding.PJ++

      // Actualizar goles
      homeStanding.GF += match.home_goals
      homeStanding.GC += match.away_goals
      awayStanding.GF += match.away_goals
      awayStanding.GC += match.home_goals

      // Determinar resultado
      if (match.home_goals > match.away_goals) {
        // Victoria local
        homeStanding.PG++
        homeStanding.PTS += pointsWin
        awayStanding.PP++
        awayStanding.PTS += pointsLoss
      } else if (match.home_goals < match.away_goals) {
        // Victoria visitante
        awayStanding.PG++
        awayStanding.PTS += pointsWin
        homeStanding.PP++
        homeStanding.PTS += pointsLoss
      } else {
        // Empate
        homeStanding.PE++
        homeStanding.PTS += pointsDraw
        awayStanding.PE++
        awayStanding.PTS += pointsDraw
      }
    })

  // Calcular diferencia de goles y tarjetas
  standings.forEach((standing) => {
    standing.DG = standing.GF - standing.GC

    // Sumar tarjetas del equipo
    const teamPlayerStats = playerStats.filter((ps) => ps.team_id === standing.team.id)
    standing.TA = teamPlayerStats.reduce((sum, ps) => sum + ps.yellow_cards, 0)
    standing.TR = teamPlayerStats.reduce((sum, ps) => sum + ps.red_cards, 0)
  })

  // Ordenar según criterio de desempate
  const sortedStandings = Array.from(standings.values()).sort((a, b) => {
    // 1. Mayor PTS primero
    if (b.PTS !== a.PTS) {
      return b.PTS - a.PTS
    }

    // 2. Mayor DG primero
    if (b.DG !== a.DG) {
      return b.DG - a.DG
    }

    // 3. Mayor GF primero
    if (b.GF !== a.GF) {
      return b.GF - a.GF
    }

    // 4. Menor GC primero
    if (a.GC !== b.GC) {
      return a.GC - b.GC
    }

    // 5. (Opcional) Menor TA primero
    return a.TA - b.TA
  })

  return sortedStandings
}

