'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
}

interface MessageThreadProps {
  selectedContact: string | null
}

export function MessageThread({ selectedContact }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const messageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedContact) {
      // In a real app, you would fetch messages for the selected contact
      // For this example, we'll use mock data
      const mockMessages: Message[] = [
        { id: 1, sender: selectedContact, content: "Hey, how are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "I'm doing well, thanks! How about you?", timestamp: "10:05 AM" },
        { id: 3, sender: selectedContact, content: "Great! Just working on some assignments.", timestamp: "10:10 AM" },
        { id: 1, sender: selectedContact, content: "Hey, how are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "I'm doing well, thanks! How about you?", timestamp: "10:05 AM" },
        { id: 3, sender: selectedContact, content: "Great! Just working on some assignments.", timestamp: "10:10 AM" },
        { id: 1, sender: selectedContact, content: "Hey, how are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "I'm doing well, thanks! How about you?", timestamp: "10:05 AM" },
        { id: 3, sender: selectedContact, content: "Great! Just working on some assignments.", timestamp: "10:10 AM" },
        { id: 1, sender: selectedContact, content: "Hey, how are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "I'm doing well, thanks! How about you?", timestamp: "10:05 AM" },
        { id: 3, sender: selectedContact, content: "Great! Just working on some assignments.", timestamp: "10:10 AM" },
        { id: 1, sender: selectedContact, content: "Hey, how are you?", timestamp: "10:00 AM" },
        { id: 2, sender: "You", content: "I'm doing well, thanks! How about you?", timestamp: "10:05 AM" },
        { id: 3, sender: selectedContact, content: "Great! Just working on some assignments.", timestamp: "10:10 AM" },
      ]
      setMessages(mockMessages)
    } else {
      setMessages([])
    }
  }, [selectedContact])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedContact) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prevMessages) => [...prevMessages, newMsg])
      setNewMessage("")
    }
  }

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a contact to start messaging</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{selectedContact}</h2>
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Image
              src="/placeholder.svg"
              alt={`${selectedContact}'s profile`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <ChevronDown className="w-4 h-4 ml-1" />
          </div>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Block User</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Report</a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div ref={messageContainerRef} className="flex-1 h-full overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`}
            className={`flex gap-2 ${message.sender === "You" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-3 py-2 ${
                message.sender === "You" ? "bg-indigo-100" : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-auto">{message.timestamp}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white rounded-r-lg px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

