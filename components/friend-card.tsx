import Image from 'next/image'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

interface Friend {
  id: number
  name: string
  avatar: string
  mutualFriends: number
}

export function FriendCard({ friend }: { friend: Friend }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
      <Image src={friend.avatar} alt={friend.name} width={50} height={50} className="rounded-full" />
      <div className="flex-grow">
        <Link href={`/profile/${friend.id}`} className="font-semibold hover:underline">
          {friend.name}
        </Link>
        <p className="text-sm text-gray-500">{friend.mutualFriends} mutual friends</p>
      </div>
      <button className="text-indigo-600 hover:text-indigo-700">
        <UserPlus size={20} />
        <span className="sr-only">Add Friend</span>
      </button>
    </div>
  )
}

