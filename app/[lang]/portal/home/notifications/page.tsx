import Link from 'next/link'

interface Notification {
  id: number
  type: 'friend_request' | 'like' | 'comment' | 'event'
  content: string
  timestamp: string
}

export default function Notifications() {
  const notifications: Notification[] = [
    { id: 1, type: 'friend_request', content: 'Alice Williams sent you a friend request', timestamp: '2 hours ago' },
    { id: 2, type: 'like', content: 'Bob Johnson liked your post', timestamp: '4 hours ago' },
    { id: 3, type: 'comment', content: 'Carol Davis commented on your post', timestamp: '1 day ago' },
    { id: 4, type: 'event', content: 'New event: Campus Job Fair', timestamp: '2 days ago' },
  ]

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map(notification => (
          <li key={notification.id} className="bg-white p-4 rounded-lg shadow">
            <p className="mb-2">{notification.content}</p>
            <span className="text-sm text-gray-500">{notification.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

