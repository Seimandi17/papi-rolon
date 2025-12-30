'use client'

import { useEffect, useState } from 'react'
import { getGroupTeams } from '@/lib/api'
import { Group, Team } from '@/lib/types'
import { Button } from '@/components/ui/Button'

interface GroupListProps {
  groups: Group[]
  teams: Team[]
  onEdit: (group: Group) => void
  onDelete: (id: string) => void
}

export function GroupList({ groups, teams, onEdit, onDelete }: GroupListProps) {
  const [groupTeamsMap, setGroupTeamsMap] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function loadGroupTeams() {
      const map: Record<string, string[]> = {}
      for (const group of groups) {
        const teamIds = await getGroupTeams(group.id)
        map[group.id] = teamIds
      }
      setGroupTeamsMap(map)
    }
    loadGroupTeams()
  }, [groups])

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupTeamIds = groupTeamsMap[group.id] || []
        const groupTeams = teams.filter((t) => groupTeamIds.includes(t.id))

        return (
          <div key={group.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(group)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => onDelete(group.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>Equipos: {groupTeams.map((t) => t.name).join(', ') || 'Ninguno'}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

