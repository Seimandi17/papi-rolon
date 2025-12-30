import { MatchWithTeams } from '@/lib/types'
import { format } from 'date-fns'
import { Card } from './ui/Card'

interface MatchCardProps {
  match: MatchWithTeams
}

export function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === 'finished'
  const matchDate = new Date(match.match_date)

  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1 mb-2 md:mb-0">
          <div className="text-xs text-gray-500 mb-1">
            {format(matchDate, "d 'de' MMMM 'a las' HH:mm")}
            {match.venue && ` • ${match.venue}`}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 text-right">
              <div className="font-semibold">{match.home_team?.name || 'TBD'}</div>
            </div>
            {isFinished ? (
              <div className="flex items-center space-x-2 px-4">
                <span className="text-2xl font-bold text-primary">{match.home_goals}</span>
                <span className="text-gray-400">-</span>
                <span className="text-2xl font-bold text-primary">{match.away_goals}</span>
              </div>
            ) : (
              <div className="px-4 text-gray-400">vs</div>
            )}
            <div className="flex-1 text-left">
              <div className="font-semibold">{match.away_team?.name || 'TBD'}</div>
            </div>
          </div>
        </div>
        <div className="mt-2 md:mt-0 md:ml-4">
          {isFinished ? (
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Finalizado
            </span>
          ) : (
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
              Programado
            </span>
          )}
        </div>
      </div>
    </Card>
  )
}

