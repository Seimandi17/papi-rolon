'use client'

import { useEffect, useState } from 'react'
import { getTournament, getPlayers, getTeams, createPlayer, updatePlayer, deletePlayer, upsertPlayerStats } from '@/lib/api'
import { PlayerWithStats, Team, Tournament } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export default function PlayersPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [players, setPlayers] = useState<PlayerWithStats[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<PlayerWithStats | null>(null)
  const [editingStats, setEditingStats] = useState<PlayerWithStats | null>(null)
  const [filterTeam, setFilterTeam] = useState<string>('all')
  const [formData, setFormData] = useState({
    name: '',
    team_id: '',
  })
  const [statsData, setStatsData] = useState({
    goals: 0,
    yellow_cards: 0,
    red_cards: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const tourn = await getTournament()
    if (tourn) {
      setTournament(tourn)
      const [playersData, teamsData] = await Promise.all([
        getPlayers(tourn.id),
        getTeams(tourn.id),
      ])
      setPlayers(playersData)
      setTeams(teamsData)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tournament) return

    if (editing) {
      const updated = await updatePlayer(editing.id, formData)
      if (updated) {
        await loadData()
        resetForm()
      }
    } else {
      const created = await createPlayer({
        tournament_id: tournament.id,
        ...formData,
      })
      if (created) {
        await loadData()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este jugador?')) return
    const success = await deletePlayer(id)
    if (success) {
      await loadData()
    }
  }

  async function handleSaveStats() {
    if (!tournament || !editingStats) return

    const success = await upsertPlayerStats(
      editingStats.id,
      tournament.id,
      statsData
    )
    if (success) {
      await loadData()
      setEditingStats(null)
      setStatsData({ goals: 0, yellow_cards: 0, red_cards: 0 })
    }
  }

  function handleEdit(player: PlayerWithStats) {
    setEditing(player)
    setFormData({
      name: player.name,
      team_id: player.team_id,
    })
  }

  function handleEditStats(player: PlayerWithStats) {
    setEditingStats(player)
    setStatsData({
      goals: player.stats?.goals || 0,
      yellow_cards: player.stats?.yellow_cards || 0,
      red_cards: player.stats?.red_cards || 0,
    })
  }

  function resetForm() {
    setEditing(null)
    setFormData({ name: '', team_id: '' })
  }

  const filteredPlayers = players.filter((player) => {
    if (filterTeam !== 'all' && player.team_id !== filterTeam) return false
    return true
  })

  if (loading || !tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editing ? 'Editar Jugador' : 'Nuevo Jugador'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Jugador *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Select
            label="Equipo *"
            options={[
              { value: '', label: 'Seleccionar...' },
              ...teams.map((t) => ({ value: t.id, label: t.name })),
            ]}
            value={formData.team_id}
            onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
            required
          />
          <div className="flex space-x-2">
            <Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button>
            {editing && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      {editingStats && (
        <Card className="mb-6 border-2 border-primary">
          <CardHeader>
            <CardTitle>Editar Estadísticas - {editingStats.name}</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Goles"
              type="number"
              min="0"
              value={statsData.goals}
              onChange={(e) => setStatsData({ ...statsData, goals: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Tarjetas Amarillas"
              type="number"
              min="0"
              value={statsData.yellow_cards}
              onChange={(e) => setStatsData({ ...statsData, yellow_cards: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Tarjetas Rojas"
              type="number"
              min="0"
              value={statsData.red_cards}
              onChange={(e) => setStatsData({ ...statsData, red_cards: parseInt(e.target.value) || 0 })}
            />
            <div className="flex space-x-2">
              <Button onClick={handleSaveStats}>Guardar Estadísticas</Button>
              <Button variant="outline" onClick={() => {
                setEditingStats(null)
                setStatsData({ goals: 0, yellow_cards: 0, red_cards: 0 })
              }}>
                Cancelar
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Jugadores ({filteredPlayers.length})</CardTitle>
            <Select
              options={[
                { value: 'all', label: 'Todos los equipos' },
                ...teams.map((t) => ({ value: t.id, label: t.name })),
              ]}
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="w-48"
            />
          </div>
        </CardHeader>
        {filteredPlayers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay jugadores registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Goles</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amarillas</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Rojas</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlayers.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {player.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {player.team?.name || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {player.stats?.goals || 0}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {player.stats?.yellow_cards || 0}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      {player.stats?.red_cards || 0}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(player)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleEditStats(player)}>
                        Stats
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(player.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}


