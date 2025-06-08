import type { Feedback } from "@/types/conversation"
import { Retell } from "retell-sdk"

export async function getCalls(): Promise<Retell.Call.CallResponse[]> {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}`)
      const calls: Retell.Call.CallResponse[] = await response.json()
      resolve(calls)
    }, 2000)
  })
}

export async function getCall(callId: string): Promise<Retell.Call.CallResponse> {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}?call_id=${callId}`)
      const calls: Retell.Call.CallResponse[] = await response.json()

      if (calls.length >= 1)
        resolve(calls[0])
    }, 2000)
  })
}

export async function updateCall(callId: string, data: Feedback, messageId: string, metadata: Record<string, Feedback>): Promise<Retell.Call.CallResponse> {
  return await new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_CALLS_API_URL}/${callId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ metadata: { ...metadata, [messageId]: data } })
        })
        const call: Retell.Call.CallResponse = await response.json()

        if (!response.ok) {
          reject()
        }

        resolve(call)
      } catch (err) {
        reject(err)
      }
    }, 2000)
  })
}
