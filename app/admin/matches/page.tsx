'use client'

import { useEffect, useState } from 'react'
import { getTournament, getMatches, getGroups, getTeams, createMatch, updateMatch, deleteMatch } from '@/lib/api'
import { MatchWithTeams, Group, Team, Tournament, Match } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'

export default function MatchesPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [matches, setMatches] = useState<MatchWithTeams[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<MatchWithTeams | null>(null)
  const [filterGroup, setFilterGroup] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [formData, setFormData] = useState({
    group_id: '',
    phase: 'groups' as 'groups' | 'elimination',
    match_date: '',
    venue: '',
    home_team_id: '',
    away_team_id: '',
    home_goals: 0,
    away_goals: 0,
    status: 'scheduled' as 'scheduled' | 'finished',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const tourn = await getTournament()
    if (tourn) {
      setTournament(tourn)
      const [matchesData, groupsData, teamsData] = await Promise.all([
        getMatches(tourn.id),
        getGroups(tourn.id),
        getTeams(tourn.id),
      ])
      setMatches(matchesData)
      setGroups(groupsData)
      setTeams(teamsData)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tournament) return

    if (formData.home_team_id === formData.away_team_id) {
      alert('El equipo local y visitante no pueden ser el mismo')
      return
    }

    const matchDataBase = {
      tournament_id: tournament.id,
      group_id: formData.group_id ? formData.group_id : undefined,
      phase: formData.phase,
      match_date: formData.match_date,
      venue: formData.venue ? formData.venue : undefined,
      home_team_id: formData.home_team_id,
      away_team_id: formData.away_team_id,
      home_goals: formData.home_goals,
      away_goals: formData.away_goals,
      status: formData.status,
    }

    if (editing) {
      const updated = await updateMatch(editing.id, matchDataBase)
      if (updated) {
        await loadData()
        resetForm()
      }
    } else {
      const created = await createMatch(matchDataBase as Omit<Match, 'id' | 'created_at' | 'updated_at'>)
      if (created) {
        await loadData()
        resetForm()
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este partido?')) return
    const success = await deleteMatch(id)
    if (success) {
      await loadData()
    }
  }

  function handleEdit(match: MatchWithTeams) {
    setEditing(match)
    const matchDate = new Date(match.match_date)
    const localDate = new Date(matchDate.getTime() - matchDate.getTimezoneOffset() * 60000)
    setFormData({
      group_id: match.group_id || '',
      phase: match.phase,
      match_date: localDate.toISOString().slice(0, 16),
      venue: match.venue || '',
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      home_goals: match.home_goals,
      away_goals: match.away_goals,
      status: match.status,
    })
  }

  function resetForm() {
    setEditing(null)
    setFormData({
      group_id: '',
      phase: 'groups',
      match_date: '',
      venue: '',
      home_team_id: '',
      away_team_id: '',
      home_goals: 0,
      away_goals: 0,
      status: 'scheduled',
    })
  }

  const filteredMatches = matches.filter((match) => {
    if (filterGroup !== 'all' && match.group_id !== filterGroup) return false
    if (filterStatus !== 'all' && match.status !== filterStatus) return false
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
          <CardTitle>{editing ? 'Editar Partido' : 'Nuevo Partido'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Grupo (opcional)"
            options={[
              { value: '', label: 'Sin grupo' },
              ...groups.map((g) => ({ value: g.id, label: g.name })),
            ]}
            value={formData.group_id}
            onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
          />
          <Select
            label="Fase"
            options={[
              { value: 'groups', label: 'Grupos' },
              { value: 'elimination', label: 'Eliminatoria' },
            ]}
            value={formData.phase}
            onChange={(e) => setFormData({ ...formData, phase: e.target.value as 'groups' | 'elimination' })}
          />
          <Input
            label="Fecha y Hora *"
            type="datetime-local"
            value={formData.match_date}
            onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
            required
          />
          <Input
            label="Cancha (opcional)"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Equipo Local *"
              options={[
                { value: '', label: 'Seleccionar...' },
                ...teams.map((t) => ({ value: t.id, label: t.name })),
              ]}
              value={formData.home_team_id}
              onChange={(e) => setFormData({ ...formData, home_team_id: e.target.value })}
              required
            />
            <Select
              label="Equipo Visitante *"
              options={[
                { value: '', label: 'Seleccionar...' },
                ...teams.map((t) => ({ value: t.id, label: t.name })),
              ]}
              value={formData.away_team_id}
              onChange={(e) => setFormData({ ...formData, away_team_id: e.target.value })}
              required
            />
          </div>
          {editing && (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Goles Local"
                type="number"
                min="0"
                value={formData.home_goals}
                onChange={(e) => setFormData({ ...formData, home_goals: parseInt(e.target.value) || 0 })}
              />
              <Input
                label="Goles Visitante"
                type="number"
                min="0"
                value={formData.away_goals}
                onChange={(e) => setFormData({ ...formData, away_goals: parseInt(e.target.value) || 0 })}
              />
            </div>
          )}
          {editing && (
            <Select
              label="Estado"
              options={[
                { value: 'scheduled', label: 'Programado' },
                { value: 'finished', label: 'Finalizado' },
              ]}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'finished' })}
            />
          )}
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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Partidos ({filteredMatches.length})</CardTitle>
            <div className="flex space-x-2">
              <Select
                options={[
                  { value: 'all', label: 'Todos los grupos' },
                  ...groups.map((g) => ({ value: g.id, label: g.name })),
                ]}
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="w-48"
              />
              <Select
                options={[
                  { value: 'all', label: 'Todos' },
                  { value: 'scheduled', label: 'Programados' },
                  { value: 'finished', label: 'Finalizados' },
                ]}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-48"
              />
            </div>
          </div>
        </CardHeader>
        {filteredMatches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay partidos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Resultado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitante</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMatches.map((match) => {
                  const matchDate = new Date(match.match_date)
                  return (
                    <tr key={match.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {format(matchDate, 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {match.home_team?.name || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        {match.status === 'finished' ? (
                          <span className="font-bold text-primary">
                            {match.home_goals} - {match.away_goals}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {match.away_team?.name || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {match.status === 'finished' ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Finalizado
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            Programado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(match)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(match.id)}>
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

