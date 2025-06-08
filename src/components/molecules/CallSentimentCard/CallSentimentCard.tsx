import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import Skeleton from "react-loading-skeleton";

interface CallSentimentProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  difference: string;
  isLoading: boolean;
}

export function CallSentimentCard({ title, icon, value, difference, isLoading }: CallSentimentProps) {
  return (
    <Card className="flex-1 gap-1 p-2 text-sm font-bold">
      <CardHeader className="flex items-center justify-between p-1">
        <p>{title}</p>
        <Tooltip>
          <TooltipTrigger asChild>
            {icon}
          </TooltipTrigger>
          <TooltipContent>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="p-1">
        <p className="text-2xl">{isLoading ? <Skeleton /> : value}</p>
        <p className="text-xs font-normal">{difference} from yesterday</p>
      </CardContent>
    </Card>
  )
}
