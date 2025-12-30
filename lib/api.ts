import { supabase } from './supabase'
import {
  Tournament,
  Team,
  Group,
  Match,
  Player,
  PlayerStats,
  MatchWithTeams,
  PlayerWithStats,
} from './types'

// Tournament
export async function getTournament(): Promise<Tournament | null> {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching tournament:', error)
    return null
  }

  return data
}

export async function createOrUpdateTournament(tournament: Partial<Tournament>): Promise<Tournament | null> {
  const existing = await getTournament()

  if (existing) {
    const { data, error } = await supabase
      .from('tournaments')
      .update(tournament)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tournament:', error)
      return null
    }

    return data
  } else {
    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ ...tournament, name: tournament.name || 'PAPI FÚTBOL ROLÓN' }])
      .select()
      .single()

    if (error) {
      console.error('Error creating tournament:', error)
      return null
    }

    return data
  }
}

// Teams
export async function getTeams(tournamentId: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('name')

  if (error) {
    console.error('Error fetching teams:', error)
    return []
  }

  return data || []
}

export async function createTeam(team: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .insert([team])
    .select()
    .single()

  if (error) {
    console.error('Error creating team:', error)
    return null
  }

  return data
}

export async function updateTeam(id: string, team: Partial<Team>): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .update(team)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating team:', error)
    return null
  }

  return data
}

export async function deleteTeam(id: string): Promise<boolean> {
  const { error } = await supabase.from('teams').delete().eq('id', id)

  if (error) {
    console.error('Error deleting team:', error)
    return false
  }

  return true
}

// Groups
export async function getGroups(tournamentId: string): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('name')

  if (error) {
    console.error('Error fetching groups:', error)
    return []
  }

  return data || []
}

export async function createGroup(group: Omit<Group, 'id' | 'created_at' | 'updated_at'>): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .insert([group])
    .select()
    .single()

  if (error) {
    console.error('Error creating group:', error)
    return null
  }

  return data
}

export async function updateGroup(id: string, group: Partial<Group>): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .update(group)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating group:', error)
    return null
  }

  return data
}

export async function deleteGroup(id: string): Promise<boolean> {
  const { error } = await supabase.from('groups').delete().eq('id', id)

  if (error) {
    console.error('Error deleting group:', error)
    return false
  }

  return true
}

// Group Teams
export async function getGroupTeams(groupId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('group_teams')
    .select('team_id')
    .eq('group_id', groupId)

  if (error) {
    console.error('Error fetching group teams:', error)
    return []
  }

  return data?.map((gt) => gt.team_id) || []
}

export async function getTeamsByGroup(groupId: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('group_teams')
    .select('team_id, teams(*)')
    .eq('group_id', groupId)

  if (error) {
    console.error('Error fetching teams by group:', error)
    return []
  }

  return (data?.map((gt: any) => gt.teams).filter(Boolean) || []) as Team[]
}

export async function setGroupTeams(groupId: string, teamIds: string[]): Promise<boolean> {
  // Eliminar relaciones existentes
  await supabase.from('group_teams').delete().eq('group_id', groupId)

  if (teamIds.length === 0) return true

  // Insertar nuevas relaciones
  const { error } = await supabase.from('group_teams').insert(
    teamIds.map((teamId) => ({
      group_id: groupId,
      team_id: teamId,
    }))
  )

  if (error) {
    console.error('Error setting group teams:', error)
    return false
  }

  return true
}

// Matches
export async function getMatches(tournamentId: string, filters?: { groupId?: string; status?: string }): Promise<MatchWithTeams[]> {
  let query = supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(*),
      away_team:teams!matches_away_team_id_fkey(*),
      group:groups(*)
    `)
    .eq('tournament_id', tournamentId)
    .order('match_date', { ascending: true })

  if (filters?.groupId) {
    query = query.eq('group_id', filters.groupId)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching matches:', error)
    return []
  }

  return (data || []) as MatchWithTeams[]
}

export async function createMatch(match: Omit<Match, 'id' | 'created_at' | 'updated_at'>): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .insert([match])
    .select()
    .single()

  if (error) {
    console.error('Error creating match:', error)
    return null
  }

  return data
}

export async function updateMatch(id: string, match: Partial<Match>): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .update(match)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating match:', error)
    return null
  }

  return data
}

export async function deleteMatch(id: string): Promise<boolean> {
  const { error } = await supabase.from('matches').delete().eq('id', id)

  if (error) {
    console.error('Error deleting match:', error)
    return false
  }

  return true
}

// Players
export async function getPlayers(tournamentId: string, teamId?: string): Promise<PlayerWithStats[]> {
  let query = supabase
    .from('players')
    .select(`
      *,
      team:teams(*),
      stats:player_stats(*)
    `)
    .eq('tournament_id', tournamentId)
    .order('name')

  if (teamId) {
    query = query.eq('team_id', teamId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching players:', error)
    return []
  }

  return (data || []) as PlayerWithStats[]
}

export async function createPlayer(player: Omit<Player, 'id' | 'created_at' | 'updated_at'>): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .insert([player])
    .select()
    .single()

  if (error) {
    console.error('Error creating player:', error)
    return null
  }

  return data
}

export async function updatePlayer(id: string, player: Partial<Player>): Promise<Player | null> {
  const { data, error } = await supabase
    .from('players')
    .update(player)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating player:', error)
    return null
  }

  return data
}

export async function deletePlayer(id: string): Promise<boolean> {
  const { error } = await supabase.from('players').delete().eq('id', id)

  if (error) {
    console.error('Error deleting player:', error)
    return false
  }

  return true
}

// Player Stats
export async function getPlayerStats(tournamentId: string): Promise<PlayerStats[]> {
  const { data, error } = await supabase
    .from('player_stats')
    .select('*')
    .eq('tournament_id', tournamentId)

  if (error) {
    console.error('Error fetching player stats:', error)
    return []
  }

  return data || []
}

export async function upsertPlayerStats(
  playerId: string,
  tournamentId: string,
  stats: { goals?: number; yellow_cards?: number; red_cards?: number }
): Promise<PlayerStats | null> {
  const { data, error } = await supabase
    .from('player_stats')
    .upsert(
      {
        player_id: playerId,
        tournament_id: tournamentId,
        goals: stats.goals ?? 0,
        yellow_cards: stats.yellow_cards ?? 0,
        red_cards: stats.red_cards ?? 0,
      },
      {
        onConflict: 'player_id,tournament_id',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting player stats:', error)
    return null
  }

  return data
}

