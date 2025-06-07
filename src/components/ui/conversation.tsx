import { getMessageDateTime } from "@/lib/formatters";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { Retell } from "retell-sdk"

interface ConversationProps {
  content: Retell.WebCallResponse.TranscriptObject[];
  isLoading: boolean;
  startDate: number;
}

export function Conversation({ content, isLoading, startDate }: ConversationProps) {
  const navigate = useNavigate()
  const selectedMessage = useSearch({ from: "/", select: (search) => search.selected_message })

  const onClickMessage = useCallback((message: number) => {
    navigate({ to: "/", search: (old) => ({ ...old, selected_message: message.toString() }), replace: true })
  }, [navigate])

  if (isLoading) {
    return <Skeleton count={10} />
  }

  if (content.length === 0) {
    return <p>No messages.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {content.map(message => {
        const isUser = message.role === "user";
        const isSelected = selectedMessage === message.words[0].start?.toString()

        return (
          <div key={message.words[0].start} className={`flex ${isUser ? "justify-end" : "justify-start"} text-sm`}>
            <div
              role="button"
              aria-roledescription="Message feedback"
              className={`flex flex-col gap-1 w-[48%] bg-slate-50 dark:bg-zinc-700 rounded-lg p-3 shadow-md border-1 ${isSelected ? "border-black dark:border-white" : "border-slate-50 dark:border-zinc-700 hover:border-black hover:dark:border-white"} cursor-pointer`}
              onClick={() => onClickMessage(message.words[0].start || 0)}
              ref={(instance) => { if (isSelected) instance?.scrollIntoView({ behavior: "smooth" }) }}
            >
              <div className="flex justify-between items-center gap-4">
                <span className="font-bold">{isUser ? "User" : "Agent"}</span>
                <span className="text-xs text-gray-500">{getMessageDateTime(startDate, (message.words[0].start || 0) * 1000)}</span>
              </div>
              <p className={``}>{message.content}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
