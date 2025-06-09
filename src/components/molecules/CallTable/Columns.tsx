import type { ColumnDef } from "@tanstack/react-table";
import { Actions } from "@/components/ui/actions";
import type { Call } from "@/types/call";
import { msToDuration, unixToTimestamp } from "@/lib/formatters";
import { SentimentBadge } from "../SentimentBadge/SentimentBadge";
import { FeedbackBadge } from "../FeedbackBadge/FeedbackBage";
import type { Feedback } from "@/types/conversation";
import { getFeedbackStatus, getIdsFromTranscript } from "@/lib/utils";

export const columns: ColumnDef<Call.CallResponse>[] = [
  {
    accessorKey: "start_timestamp",
    header: () => <span className="font-bold">Timestamp</span>,
    cell: ({ row }) => {
      return <span>{unixToTimestamp(row.getValue("start_timestamp"))}</span>
    }
  },
  {
    accessorKey: "agent_id",
    header: () => <span className="font-bold">Agent ID</span>
  },
  {
    accessorKey: "call_analysis.user_sentiment",
    header: () => <span className="font-bold">Sentiment</span>,
    cell: ({ row }) => {
      return <SentimentBadge sentiment={row.original.call_analysis?.user_sentiment || "Unknown"} />
    }
  },
  {
    accessorKey: "duration_ms",
    header: () => <span className="font-bold">Duration</span>,
    cell: ({ row }) => {
      return <span>{msToDuration(row.getValue("duration_ms"))}</span>
    }
  },
  {
    accessorKey: "feedback",
    header: () => <span className="font-bold">Feedback Status</span>,
    cell: ({ row }) => {
      const ids = getIdsFromTranscript(row.original?.transcript_object as Call.WebCallResponse.TranscriptObject[])
      return <FeedbackBadge feedback={getFeedbackStatus(ids, row.original.metadata as Record<string, Feedback[]> | undefined)} />
    }
  },
  {
    accessorKey: "Actions",
    header: () => <span className="font-bold">Actions</span>,
    cell: ({ row }) => {
      return <Actions audioUrl={row.original.recording_url || ""} callId={row.original.call_id || ""} />
    }
  }
]
