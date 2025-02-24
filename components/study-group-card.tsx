interface StudyGroup {
  id: number
  name: string
  course: string
  members: number
  nextMeeting: string
}

export function StudyGroupCard({ group }: { group: StudyGroup }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-2 truncate">{group.name}</h3>
      <p className="text-gray-600 mb-2 truncate">{group.course}</p>
      <p className="text-gray-600 mb-2">Members: {group.members}</p>
      <p className="text-gray-500 mb-4 truncate">Next: {group.nextMeeting}</p>
      <button 
        onClick={() => window.location.href = `/study-groups/${group.id}`}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 inline-block mr-2"
      >
        Details
      </button>
      <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
        Join
      </button>
    </div>
  )
}

