'use client'

import { useState } from 'react'

export default function Points() {
  const [points, setPoints] = useState(150)
  const [history, setHistory] = useState([
    { id: 1, action: 'Submitted course evaluation', points: 10, date: '2023-06-01' },
    { id: 2, action: 'Viewed course evaluations', points: -50, date: '2023-06-02' },
    { id: 3, action: 'Submitted course evaluation', points: 10, date: '2023-06-03' },
  ])

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Points</h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-2">Total Points: {points}</h2>
        <p className="text-gray-600">Use your points to view course evaluations or unlock other features.</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Point History</h2>
        <ul className="space-y-4">
          {history.map((item) => (
            <li key={item.id} className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-semibold">{item.action}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span className={`font-semibold ${item.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.points > 0 ? '+' : ''}{item.points}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

