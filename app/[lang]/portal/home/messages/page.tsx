'use client'

import { useState } from 'react'
import { MessageList } from '@/components/message-list'
import { MessageThread } from '@/components/message-thread'

export default function Messages() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  return (
    <div className="flex h-full bg-white">
      <MessageList onSelectContact={setSelectedContact} />
      <MessageThread selectedContact={selectedContact} />
    </div>
  )
}