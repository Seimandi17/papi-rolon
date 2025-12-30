import { PlayerWithStats } from '@/lib/types'
import { Card } from './ui/Card'

interface CardsTableProps {
  players: PlayerWithStats[]
  type: 'yellow' | 'red'
}

export function CardsTable({ players, type }: CardsTableProps) {
  const cardPlayers = players
    .filter((p) => {
      if (type === 'yellow') {
        return (p.stats?.yellow_cards || 0) > 0
      }
      return (p.stats?.red_cards || 0) > 0
    })
    .sort((a, b) => {
      if (type === 'yellow') {
        return (b.stats?.yellow_cards || 0) - (a.stats?.yellow_cards || 0)
      }
      return (b.stats?.red_cards || 0) - (a.stats?.red_cards || 0)
    })
    .slice(0, 20)

  if (cardPlayers.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">
          No hay tarjetas {type === 'yellow' ? 'amarillas' : 'rojas'} registradas
        </p>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={`text-white ${type === 'yellow' ? 'bg-yellow-500' : 'bg-red-600'}`}>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Pos</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Jugador</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Equipo</th>
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
              {type === 'yellow' ? 'Amarillas' : 'Rojas'}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cardPlayers.map((player, index) => (
            <tr key={player.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {player.name}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {player.team?.name || '-'}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-center">
                {type === 'yellow' ? player.stats?.yellow_cards || 0 : player.stats?.red_cards || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


