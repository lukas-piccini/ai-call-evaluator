import { useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
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
import { Rating } from "./rating";
import { useFeedbackForm } from "@/stores/feedback-form";

import type { ConversationProps, ConversationMessageProps, ConversationFeedbackFormProps, Feedback } from "@/types/conversation";
import { FeedbackTags } from "@/types/conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCall } from "@/services/call";
import { toast } from "sonner";
import { LoaderIcon } from "lucide-react";
import { getFeedbackForCurrentMessage } from "@/lib/utils";
import { FeedbackTag } from "@/components/molecules/FeedbackTag/FeedbackTag";

const FeedbackFormSchema = z.object({
  comment: z.string({
    required_error: "Comment is required."
  }).min(5, {
    message: "Comment must be atleast 5 characters.",
  }),
  rating: z.enum(["0", "1", "2", "3", "4", "5"], {
    required_error: "Rating is required."
  }),
  tags: z.array(z.nativeEnum(FeedbackTags)).optional()
})

function ConversationFeedbackForm({ metadata }: ConversationFeedbackFormProps) {
  const [callId, selectedMessage] = useSearch({ from: "/", select: (search) => ([search.call_id, search.selected_message]) })
  const { dirty, setDirty } = useFeedbackForm(state => state)
  const navigate = useNavigate()

  const feedback = getFeedbackForCurrentMessage(metadata, selectedMessage)

  const form = useForm<z.infer<typeof FeedbackFormSchema>>({
    resolver: zodResolver(FeedbackFormSchema),
    defaultValues: {
      comment: feedback?.comment,
      rating: feedback?.rating,
      tags: feedback?.tags
    }
  })

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: ({ data }: { data: Feedback }) => {
      return updateCall(callId, data, selectedMessage, metadata)
    },
    onSuccess: () => {
      toast.success("Feedback sent successfully")
      queryClient.invalidateQueries({ queryKey: ["call", callId] })
      queryClient.invalidateQueries({ queryKey: ["calls"] })
      navigate({ to: "/", search: (old) => ({ ...old, selected_message: undefined }), replace: true, resetScroll: false })
    },
    onError: () => {
      toast.error("Error sending your feedback. Try again later.")
    },
    retry: false
  })

  const hasChanged = form.formState.isDirty
  const submitDisabled = !hasChanged || isPending

  useEffect(() => {
    if (dirty !== hasChanged)
      setDirty(hasChanged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChanged])

  useEffect(() => {
    return () => {
      setDirty(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(data: z.infer<typeof FeedbackFormSchema>) {
    if (!hasChanged) return;

    mutate({ data })
  }

  return (
    <Form {...form}>
      <form name="feedback-form" id="feedback-form" onSubmit={form.handleSubmit(onSubmit)} onClick={e => e.stopPropagation()}>
        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm italic text-gray-600 dark:text-white">Feedback</span>

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem >
                  <FormControl>
                    <Rating {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem >
                <FormControl>
                  <FeedbackTag {...field} value={field.value || []} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="sm" type="submit" disabled={submitDisabled} aria-disabled={submitDisabled}>{isPending ? <LoaderIcon className="animate-spin" /> : "Save"}</Button>
        </div>
      </form>
    </Form >
  )
}

function ConversationMessage({ message, startDate, metadata }: ConversationMessageProps) {
  const navigate = useNavigate()
  const selectedMessage = useSearch({ from: "/", select: (search) => search.selected_message })
  const { dirty } = useFeedbackForm(state => state)

  //const currentFeedback = getFeedbackForCurrentMessage(metadata, selectedMessage)
  const isUser = message.role === "user";
  const isSelected = selectedMessage === message.words[0].start?.toString()
  const ref = useRef<HTMLDivElement | null>(null)

  const onClickMessage = useCallback((message: number) => {
    const newSelectedMessage = isSelected ? undefined : message.toString()

    if (dirty) {
      if (!confirm("You have unsaved changes. Do you really want to close this feedback?"))
        return
    }

    navigate({ to: "/", search: (old) => ({ ...old, selected_message: newSelectedMessage }), replace: true, resetScroll: false })
  }, [navigate, isSelected, dirty])

  useEffect(() => {
    if (!ref.current) return;

    if (isSelected) ref.current.scrollIntoView({ behavior: "smooth" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} text-sm`}>
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
        <p>{message.content}</p>
        <AnimatePresence>
          {isSelected && (
            <motion.div key="feedback-controls" transition={{ y: { bounce: 0 } }} exit={{ opacity: 0, scale: 0, height: 0 }} initial={{ opacity: 0, scale: 0, height: 0 }} animate={{ opacity: 1, scale: 1, height: "auto" }}>
              <ConversationFeedbackForm metadata={metadata as Record<string, Feedback>} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function Conversation({ content, isLoading, startDate }: ConversationProps) {
  if (isLoading) {
    return <Skeleton count={10} />
  }

  if (content?.transcript_object?.length === 0) {
    return <p>No messages.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {content?.transcript_object?.map(message => {
        return (
          <ConversationMessage key={message.words[0].start} metadata={content.metadata} startDate={startDate} message={message} />
        )
      })}
    </div>
  )
}
