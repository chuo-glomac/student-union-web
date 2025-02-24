import Link from 'next/link'
import { useState } from 'react'
import { LikeIcon, CommentIcon } from './icons'

interface Post {
  id: number
  author: string
  content: string
  timestamp: string
  likes: number
  comments: Comment[]
}

interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
}

export function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle comment submission logic here
    console.log('New comment:', newComment)
    setNewComment('')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <Link href={`/profile/${post.author}`} className="font-semibold hover:underline">
          {post.author}
        </Link>
        <span className="text-gray-500 text-sm">{post.timestamp}</span>
      </div>
      <p className="mb-4">{post.content}</p>
      <div className="flex justify-between items-center text-gray-500">
        <button className="flex items-center space-x-1 hover:text-indigo-600">
          <LikeIcon />
          <span>{post.likes} Likes</span>
        </button>
        <button 
          className="flex items-center space-x-1 hover:text-indigo-600"
          onClick={() => setShowComments(!showComments)}
        >
          <CommentIcon />
          <span>{post.comments.length} Comments</span>
        </button>
      </div>
      {showComments && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Comments</h4>
          {post.comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-3 rounded mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{comment.author}</span>
                <span className="text-gray-500 text-xs">{comment.timestamp}</span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
          <form onSubmit={handleSubmitComment} className="mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-3 py-2 border rounded"
            />
            <button type="submit" className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Post Comment
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

