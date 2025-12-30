'use client'

import { useEffect, useState } from 'react'
import { getTournament, getGroups, getTeams, createGroup, updateGroup, deleteGroup, setGroupTeams, getGroupTeams } from '@/lib/api'
import { Group, Team, Tournament } from '@/lib/types'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GroupList } from './GroupList'

export default function GroupsPage() {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [groups, setGroups] = useState<Group[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Group | null>(null)
  const [editingTeams, setEditingTeams] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const tourn = await getTournament()
    if (tourn) {
      setTournament(tourn)
      const [groupsData, teamsData] = await Promise.all([
        getGroups(tourn.id),
        getTeams(tourn.id),
      ])
      setGroups(groupsData)
      setTeams(teamsData)
    }
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tournament) return

    if (editing) {
      const updated = await updateGroup(editing.id, formData)
      if (updated) {
        await setGroupTeams(editing.id, editingTeams)
        await loadData()
        setEditing(null)
        setFormData({ name: '' })
        setEditingTeams([])
      }
    } else {
      const created = await createGroup({
        tournament_id: tournament.id,
        ...formData,
      })
      if (created) {
        await setGroupTeams(created.id, editingTeams)
        await loadData()
        setFormData({ name: '' })
        setEditingTeams([])
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este grupo?')) return
    const success = await deleteGroup(id)
    if (success) {
      await loadData()
    }
  }

  async function handleEdit(group: Group) {
    setEditing(group)
    setFormData({ name: group.name })
    const teamIds = await getGroupTeams(group.id)
    setEditingTeams(teamIds)
  }

  function toggleTeam(teamId: string) {
    setEditingTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    )
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
          <CardTitle>{editing ? 'Editar Grupo' : 'Nuevo Grupo'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Grupo *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipos del Grupo
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {teams.map((team) => (
                <label key={team.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTeams.includes(team.id)}
                    onChange={() => toggleTeam(team.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{team.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button>
            {editing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditing(null)
                  setFormData({ name: '' })
                  setEditingTeams([])
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
          <CardTitle>Grupos ({groups.length})</CardTitle>
        </CardHeader>
        {groups.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay grupos registrados</p>
        ) : (
          <GroupList groups={groups} teams={teams} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  )
}

