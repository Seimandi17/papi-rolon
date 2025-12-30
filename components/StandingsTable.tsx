import { TeamStanding } from '@/lib/types'
import { Card, CardHeader, CardTitle } from './ui/Card'

interface StandingsTableProps {
  standings: TeamStanding[]
}

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <Card>
        <p className="text-gray-500 text-center py-8">No hay equipos en este grupo</p>
      </Card>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary text-white">
          <tr>
            <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Pos</th>
            <th className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">Equipo</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">PJ</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">PTS</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">PG</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">PE</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">PP</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">GF</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">GC</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">DG</th>
            <th className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider">TA</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {standings.map((standing, index) => (
            <tr key={standing.team.id} className={index < 2 ? 'bg-yellow-50' : ''}>
              <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {index + 1}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {standing.team.name}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.PJ}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm font-bold text-primary text-center">
                {standing.PTS}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.PG}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.PE}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.PP}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.GF}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.GC}
              </td>
              <td className={`px-2 py-3 whitespace-nowrap text-sm text-center font-medium ${
                standing.DG > 0 ? 'text-green-600' : standing.DG < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {standing.DG > 0 ? '+' : ''}{standing.DG}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                {standing.TA}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

