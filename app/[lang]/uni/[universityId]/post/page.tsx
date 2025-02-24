import { PostCard } from '@/components/post-card'

export default function Feed() {
  const posts = [
    { 
      id: 1, 
      author: 'John Doe', 
      content: 'Just finished my final project!', 
      timestamp: '2 hours ago', 
      likes: 15, 
      comments: [
        { id: 1, author: 'Jane Smith', content: 'Congratulations!', timestamp: '1 hour ago' },
        { id: 2, author: 'Bob Johnson', content: 'Well done!', timestamp: '30 minutes ago' },
      ]
    },
    { 
      id: 2, 
      author: 'Jane Smith', 
      content: 'Looking for study partners for the upcoming exam. Anyone interested?', 
      timestamp: '4 hours ago', 
      likes: 8, 
      comments: [
        { id: 3, author: 'Alice Williams', content: 'I\'m in! When and where?', timestamp: '3 hours ago' },
      ]
    },
  ]

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Your Feed</h2>
      <div className="space-y-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}