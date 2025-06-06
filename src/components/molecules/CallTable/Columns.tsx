import type { ColumnDef } from "@tanstack/react-table";
import { Actions } from "@/components/ui/actions";
import type Retell from "retell-sdk";
import { msToDuration, unixToTimestamp } from "@/lib/formatters";

export const columns: ColumnDef<Retell.Call.CallResponse>[] = [
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
    header: () => <span className="font-bold">Sentiment</span>
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
    header: () => <span className="font-bold">Feedback Status</span>
  },
  {
    accessorKey: "Actions",
    header: () => <span className="font-bold">Actions</span>,
    cell: ({ row }) => {
      return <Actions audioUrl={row.original.recording_url || ""} callId={row.original.call_id || ""} />
    }
  }
]
