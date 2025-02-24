'use client'

import { useState } from 'react'
import { User } from 'lucide-react'

interface Contact {
  id: number
  name: string
  lastMessage: string
  timestamp: string
}

interface MessageListProps {
  onSelectContact: (contactName: string) => void
}

const contacts: Contact[] = [
  { id: 1, name: "Alice Johnson", lastMessage: "Hey, how are you?", timestamp: "10:30 AM" },
  { id: 2, name: "Bob Smith", lastMessage: "Did you finish the assignment?", timestamp: "Yesterday" },
  { id: 3, name: "Carol Williams", lastMessage: "See you at the study group!", timestamp: "Mon" },
]

export function MessageList({ onSelectContact }: MessageListProps) {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null)

  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id)
    onSelectContact(contact.name)
  }

  return (
    <div className="w-1/3 border-r overflow-y-auto">
      <h2 className="text-xl font-semibold p-4 border-b">Messages</h2>
      <ul>
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className={`p-4 hover:bg-gray-100 cursor-pointer ${
              selectedContactId === contact.id ? "bg-gray-100" : ""
            }`}
            onClick={() => handleSelectContact(contact)}
          >
            <div className="flex items-center">
              <User className="w-10 h-10 rounded-full bg-gray-300 p-2 mr-3" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{contact.lastMessage}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

