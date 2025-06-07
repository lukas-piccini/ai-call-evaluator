import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { Retell } from "retell-sdk"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getMessageDateTime } from "@/lib/formatters";

import Skeleton from "react-loading-skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";

interface ConversationProps {
  content: Retell.WebCallResponse.TranscriptObject[];
  isLoading: boolean;
  startDate: number;
}

interface ConversationMessageProps {
  message: Retell.WebCallResponse.TranscriptObject;
  startDate: number;
}

enum FeedbackTags {
  INACCURATE_SENTIMENT = "Inaccurate sentiment",
  CRITICAL_ISSUE = "Critical issue",
  FOLLOWUP_NEEDED = "Followup needed"
}

interface Feedback {
  comment?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  tags?: FeedbackTags[]
}

interface ConversationFeedbackFormProps {
  feedback?: Feedback
}

const FeedbackFormSchema = z.object({
  comment: z.string({
    required_error: "Comment is required."
  }).min(5, {
    message: "Comment must be atleast 5 characters.",
  }),
  rating: z.number().gte(1).lte(5).optional(),
  tags: z.array(z.nativeEnum(FeedbackTags)).optional()
})

function ConversationFeedbackForm({ feedback }: ConversationFeedbackFormProps) {
  const form = useForm<z.infer<typeof FeedbackFormSchema>>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      comment: feedback?.comment,
      rating: feedback?.rating,
      tags: feedback?.tags
    }
  })

  function onSubmit(data: z.infer<typeof FeedbackFormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form name="feedback-form" id="feedback-form" onSubmit={form.handleSubmit(onSubmit)} onClick={e => e.stopPropagation()}>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem >
                <FormControl>
                  <Textarea placeholder="Write your review here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="sm" type="submit">Save</Button>
        </div>
      </form>
    </Form >
  )
}

function ConversationMessage({ message, startDate }: ConversationMessageProps) {
  const navigate = useNavigate()
  const selectedMessage = useSearch({ from: "/", select: (search) => search.selected_message })
  const isUser = message.role === "user";
  const isSelected = selectedMessage === message.words[0].start?.toString()
  const ref = useRef<HTMLDivElement | null>(null)

  const onClickMessage = useCallback((message: number) => {
    const newSelectedMessage = isSelected ? undefined : message.toString()

    navigate({ to: "/", search: (old) => ({ ...old, selected_message: newSelectedMessage }), replace: true })
  }, [navigate, isSelected])

  useEffect(() => {
    if (!ref.current) return;

    if (isSelected) ref.current.scrollIntoView({ behavior: "smooth" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div className={`flex ${isUser ? "justify-end" : "justify-start"} text-sm`}>
      <div
        role="button"
        aria-roledescription="Message feedback"
        tabIndex={0}
        className={`flex flex-col gap-1 w-[85%] md:w-[48%] focus:outline-none bg-slate-50 dark:bg-zinc-700 rounded-lg p-3 shadow-md border-1 ${isSelected ? "border-black dark:border-white" : "border-slate-50 dark:border-zinc-700 hover:border-black focus:border-black hover:dark:border-white"} cursor-pointer`}
        onClick={() => onClickMessage(message.words[0].start || 0)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (ref.current) ref.current.click()
          }
        }}
        ref={ref}
      >
        <div className="flex justify-between items-center gap-4">
          <span className="font-bold">{isUser ? "User" : "Agent"}</span>
          <span className="text-xs text-gray-500">{getMessageDateTime(startDate, (message.words[0].start || 0) * 1000)}</span>
        </div>
        <p className={``}>{message.content}</p>
        <AnimatePresence>
          {isSelected && (
            <motion.div key="feedback-constrols" exit={{ opacity: 0, scale: 0, height: 0 }} initial={{ opacity: 0, scale: 0, height: 0 }} animate={{ opacity: 1, scale: 1, height: "auto" }}>
              <ConversationFeedbackForm feedback={{ comment: "I really like this interation" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function Conversation({ content, isLoading, startDate }: ConversationProps) {
  if (isLoading) {
    return <Skeleton count={10} />
  }

  if (content.length === 0) {
    return <p>No messages.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {content.map(message => {
        return (
          <ConversationMessage key={message.words[0].start} startDate={startDate} message={message} />
        )
      })}
    </div>
  )
}
