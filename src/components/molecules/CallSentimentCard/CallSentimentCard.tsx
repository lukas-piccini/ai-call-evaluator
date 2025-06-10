import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import Skeleton from "react-loading-skeleton";
import type { Outlier } from "@/lib/aggregator";

interface CallSentimentProps {
  title: string;
  icon?: React.ReactNode;
  value: string;
  difference: string;
  outlier?: Outlier;
  isLoading: boolean;
}

export function CallSentimentCard({ title, icon, value, difference, isLoading, outlier }: CallSentimentProps) {
  return (
    <Card className="flex-1 gap-1 p-2 text-sm font-bold">
      <CardHeader className="flex items-center justify-between p-1">
        <p>{title}</p>

        {outlier && icon && (
          <Tooltip>
            <TooltipTrigger asChild>
              {icon}
            </TooltipTrigger>
            <TooltipContent>
              {isLoading ? <Skeleton width={150} height={12} count={2} /> : (
                <>
                  <p>{outlier.max}</p>
                  <p>{outlier.min}</p>
                </>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent className="p-1">
        <p className="text-2xl">{isLoading ? <Skeleton /> : value}</p>
        <p className="text-xs font-normal">{isLoading ? <Skeleton /> : <>{difference} from yesterday</>}</p>
      </CardContent>
    </Card>
  )
}
