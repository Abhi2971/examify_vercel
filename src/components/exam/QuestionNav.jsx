import { clsx } from 'clsx'

export function QuestionNav({ total, current, answers, onSelect }) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Question Navigator</h3>
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const qNum = i + 1
          const isAnswered = answers[qNum] !== undefined
          const isCurrent = qNum === current
          return (
            <button key={i} onClick={() => onSelect(qNum)}
              className={clsx(
                'w-10 h-10 rounded-lg font-medium text-sm transition-colors',
                isCurrent && 'ring-2 ring-primary-500',
                isAnswered ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              )}>
              {qNum}
            </button>
          )
        })}
      </div>
      <div className="text-sm space-y-1">
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded" /> Answered</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" /> Not Visited</div>
      </div>
    </div>
  )
}
