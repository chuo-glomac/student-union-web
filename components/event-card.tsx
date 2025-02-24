interface Event {
  id: number
  title: string
  date: string
  location: string
  attendees: number
}

export function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
      <p className="text-gray-600 mb-2">Date: {event.date}</p>
      <p className="text-gray-600 mb-2">Location: {event.location}</p>
      <p className="text-gray-500 mb-4">{event.attendees} attending</p>
      <button 
        onClick={() => window.location.href = `/events/${event.id}`}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 inline-block mr-2"
      >
        Details
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        RSVP
      </button>
    </div>
  )
}

