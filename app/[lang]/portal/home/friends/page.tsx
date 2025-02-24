import {FriendCard } from '@/components/friend-card'

export default function Friends() {
  const friends = [
    { id: 1, name: 'Alice Williams', avatar: '/placeholder.svg', mutualFriends: 15 },
    { id: 2, name: 'Bob Johnson', avatar: '/placeholder.svg', mutualFriends: 8 },
    { id: 3, name: 'Carol Davis', avatar: '/placeholder.svg', mutualFriends: 12 },
  ]

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Your Friends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))}
      </div>
    </div>
  )
}