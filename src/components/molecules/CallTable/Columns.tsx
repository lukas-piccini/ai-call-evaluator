import type { ColumnDef } from "@tanstack/react-table";
import { Actions } from "@/components/ui/actions";
import type Retell from "retell-sdk";
import { msToDuration, unixToTimestamp } from "@/lib/formatters";

export const columns: ColumnDef<Retell.Call.CallResponse>[] = [
  {
    accessorKey: "start_timestamp",
    header: () => <div className="font-bold">Timestamp</div>,
    cell: ({ row }) => {
      return <span>{unixToTimestamp(row.getValue("start_timestamp"))}</span>
    }
  },
  {
    accessorKey: "agent_id",
    header: () => <div className="font-bold">Agent ID</div>
  },
  {
    accessorKey: "call_analysis.user_sentiment",
    header: () => <div className="font-bold">Sentiment</div>
  },
  {
    accessorKey: "duration_ms",
    header: () => <div className="font-bold">Duration</div>,
    cell: ({ row }) => {
      return <span>{msToDuration(row.getValue("duration_ms"))}</span>
    }
  },
  {
    accessorKey: "feedback",
    header: () => <div className="font-bold">Feedback Status</div>
  },
  {
    accessorKey: "Actions",
    header: () => <div className="font-bold">Actions</div>,
    cell: ({ row }) => {
      return <Actions audioUrl={row.original.recording_url || ""} callId={row.original.call_id || ""} />
    }
  }
]
