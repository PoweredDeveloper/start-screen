import { useEffect, useState } from 'react'

export default function Time() {
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    setInterval(() => setDate(new Date()), 30000)
  }, [])

  return (
    <div className="text-zinc-200 font-extrabold flex flex-col items-center gap-2 select-none">
      <span className="text-9xl">
        {date.toLocaleTimeString('ru', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      <span className="text-2xl capitalize">
        {date.toLocaleDateString('ru', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
      </span>
    </div>
  )
}
