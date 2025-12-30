import { PlayerWithStats } from '@/lib/types'
import { Card } from './ui/Card'

interface ScorersTableProps {
  players: PlayerWithStats[]
}

export function ScorersTable({ players }: ScorersTableProps) {
  const scorers = players
    .filter((p) => (p.stats?.goals || 0) > 0)
    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
    .slice(0, 20)

  if (scorers.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No hay goleadores registrados</p>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pos</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Jugador</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Equipo</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Goles</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {scorers.map((player, index) => (
            <tr key={player.id} className={index < 3 ? 'bg-yellow-50' : ''}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {player.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {player.team?.name || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-primary text-center">
                {player.stats?.goals || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

