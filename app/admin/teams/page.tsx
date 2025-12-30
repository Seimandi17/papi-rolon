'use client'

import { useEffect, useState } from 'react'
import { getTournament, getTeams, createTeam, updateTeam, deleteTeam } from '@/lib/api'
import { Team, Tournament } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function TeamsPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Team | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    logo_url: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const tourn = await getTournament()
    if (tourn) {
      setTournament(tourn)
      const teamsData = await getTeams(tourn.id)
      setTeams(teamsData)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tournament) return

    if (editing) {
      const updated = await updateTeam(editing.id, formData)
      if (updated) {
        await loadData()
        setEditing(null)
        setFormData({ name: '', color: '', logo_url: '' })
      }
    } else {
      const created = await createTeam({
        tournament_id: tournament.id,
        ...formData,
      })
      if (created) {
        await loadData()
        setFormData({ name: '', color: '', logo_url: '' })
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este equipo?')) return
    const success = await deleteTeam(id)
    if (success) {
      await loadData()
    }
  }

  function handleEdit(team: Team) {
    setEditing(team)
    setFormData({
      name: team.name,
      color: team.color || '',
      logo_url: team.logo_url || '',
    })
  }

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
          <CardTitle>{editing ? 'Editar Equipo' : 'Nuevo Equipo'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Equipo *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Color (opcional)"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="#000000"
          />
          <Input
            label="URL del Logo (opcional)"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            placeholder="https://..."
          />
          <div className="flex space-x-2">
            <Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null)
                  setFormData({ name: '', color: '', logo_url: '' })
                }}
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipos ({teams.length})</CardTitle>
        </CardHeader>
        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay equipos registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {team.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {team.color && (
                        <span
                          className="inline-block w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: team.color }}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(team)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(team.id)}>
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


