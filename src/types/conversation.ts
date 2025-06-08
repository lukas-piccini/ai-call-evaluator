import { Retell } from "retell-sdk"

export interface ConversationProps {
  content?: Retell.CallResponse;
  isLoading: boolean;
  startDate: number;
}

export interface ConversationMessageProps {
  metadata: unknown;
  message: Retell.WebCallResponse.TranscriptObject;
  startDate: number;
}

export enum FeedbackTags {
  INACCURATE_SENTIMENT = "Inaccurate sentiment",
  CRITICAL_ISSUE = "Critical issue",
  FOLLOWUP_NEEDED = "Followup needed"
}

export type RatingType = "0" | "1" | "2" | "3" | "4" | "5";


export interface Feedback {
  comment?: string;
  rating?: RatingType;
  tags?: FeedbackTags[]
}

export enum FeedbackStatus {
  NOT_STARTED = "Not started",
  PENDING = "Pending",
  COMPLETED = "Completed"
}

export interface ConversationFeedbackFormProps {
  metadata?: Record<string, Feedback>;
}


