"use client"

import { useState } from "react"
import { EmailViewer } from "./parts/email-viewer"
import { AudioPlayer } from "./parts/audio-player"
import { ConversionArrow } from "./parts/conversion-arrow"
import { emails } from "./data/mock-emails"

export default function NewsletterToPodcast() {
  const [selectedEmailId, setSelectedEmailId] = useState(1)

  const audioUrl = "https://uvctvecbobqepkqrcshc.supabase.co/storage/v1/object/public/Podcast%20Audio%20Files/AI's%20Impact%20on%20the%20Future%20of%20Work%20and%20Learning.mp3?t=2025-01-25T16%3A21%3A37.007Z"

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-auto">
          <EmailViewer emails={emails} selectedId={selectedEmailId} onSelect={setSelectedEmailId} unreadCount={1537} />
        </div>
        <ConversionArrow />
        <div className="w-full md:w-auto flex justify-center">
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      </div>
    </div>
  )
}

