export interface Tournament {
  id: string
  name: string
  edition?: string
  year?: number
  points_win: number
  points_draw: number
  points_loss: number
  created_at: string
  updated_at: string
}

export interface Team {
  id: string
  tournament_id: string
  name: string
  logo_url?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  tournament_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface GroupTeam {
  id: string
  group_id: string
  team_id: string
  created_at: string
}

export interface Match {
  id: string
  tournament_id: string
  group_id?: string
  phase: 'groups' | 'elimination'
  match_date: string
  venue?: string
  home_team_id: string
  away_team_id: string
  home_goals: number
  away_goals: number
  status: 'scheduled' | 'finished'
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  tournament_id: string
  team_id: string
  name: string
  created_at: string
  updated_at: string
}

export interface PlayerStats {
  id: string
  player_id: string
  tournament_id: string
  goals: number
  yellow_cards: number
  red_cards: number
  created_at: string
  updated_at: string
}

export interface TeamStanding {
  team: Team
  PJ: number // Partidos jugados
  PG: number // Partidos ganados
  PE: number // Partidos empatados
  PP: number // Partidos perdidos
  GF: number // Goles a favor
  GC: number // Goles en contra
  DG: number // Diferencia de goles
  PTS: number // Puntos
  TA: number // Tarjetas amarillas
  TR: number // Tarjetas rojas
}

export interface MatchWithTeams extends Match {
  home_team?: Team
  away_team?: Team
  group?: Group
}

export interface PlayerWithStats extends Player {
  stats?: PlayerStats
  team?: Team
}


