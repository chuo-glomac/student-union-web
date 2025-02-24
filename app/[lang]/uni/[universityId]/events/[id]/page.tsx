'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Event {
  id: number
  title: string
  date: string
  location: string
  description: string
  organizer: string
  attendees: number
}

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the event data from an API
    // For this example, we'll use mock data
    const mockEvent: Event = {
      id: Number(id),
      title: 'Campus Job Fair',
      date: '2023-09-15',
      location: 'Student Center',
      description: 'Connect with potential employers and explore career opportunities across various industries.',
      organizer: 'Career Services Department',
      attendees: 150
    }
    setEvent(mockEvent)
  }, [id])

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 lg:p-8">
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-gray-600 mb-2">Date: {event.date}</p>
        <p className="text-gray-600 mb-2">Location: {event.location}</p>
        <p className="text-gray-600 mb-2">Organizer: {event.organizer}</p>
        <p className="text-gray-600 mb-4">Attendees: {event.attendees}</p>
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 mb-4">{event.description}</p>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-2">
          RSVP
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          Add to Calendar
        </button>
      </div>
      <Link href="/events" className="block mt-4 text-indigo-600 hover:underline">
        ← Back to Events
      </Link>
    </div>
    </div>
  )
}

