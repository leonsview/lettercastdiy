"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from "react-markdown"

interface Email {
  id: number
  subject: string
  preview: string
  date: string
  content: string
  from: string
}

interface EmailViewerProps {
  emails: Email[]
  selectedId: number
  onSelect: (id: number) => void
  unreadCount: number
}

export function EmailViewer({ emails, selectedId, onSelect, unreadCount }: EmailViewerProps) {
  return (
    <div className="w-full max-w-2xl h-[500px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex h-full">
        <div className="w-64 border-r bg-gray-50">
          <div className="p-2 border-b bg-gray-100 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">Inbox</div>
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          </div>
          <ScrollArea className="h-[calc(100%-41px)]">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => onSelect(email.id)}
                className={`w-full p-3 text-left border-b hover:bg-gray-100 transition-colors ${
                  selectedId === email.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-sm font-semibold truncate">{email.subject}</div>
                <div className="text-xs text-gray-500 mt-1 truncate">{email.preview}</div>
                <div className="text-xs text-gray-400 mt-1">{format(new Date(email.date), "MMM d, yyyy")}</div>
              </button>
            ))}
          </ScrollArea>
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="border-b p-4 bg-gray-50">
            {emails.map((email) => (
              <div key={email.id} className={`${selectedId === email.id ? "block" : "hidden"}`}>
                <h2 className="text-xl font-semibold">{email.subject}</h2>
                <div className="text-sm text-gray-600 mt-1">From: {email.from}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {format(new Date(email.date), "MMMM d, yyyy 'at' h:mm a")}
                </div>
              </div>
            ))}
          </div>
          <ScrollArea className="flex-1">
            {emails.map((email) => (
              <div key={email.id} className={`p-4 ${selectedId === email.id ? "block" : "hidden"}`}>
                <ReactMarkdown
                  className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                    strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                    em: ({ node, ...props }) => <em className="italic" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
                    ),
                  }}
                >
                  {email.content}
                </ReactMarkdown>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

