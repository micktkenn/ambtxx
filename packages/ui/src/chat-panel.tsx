import type { ChatMessage } from "@amlbt/types";
import { cn } from "./cn";

export function ChatPanel({ messages }: { messages: ChatMessage[] }) {
  return (
    <div>
      <div className="min-h-80 space-y-2 rounded-card border border-amlbt-border-soft bg-slate-50 p-3">
        {messages.map((message) => (
          <div key={message.id} className={cn("max-w-[82%] rounded-2xl border px-3 py-2 text-sm", message.senderType === "user" && "ml-auto border-blue-200 bg-amlbt-primary-soft", message.senderType === "counterparty" && "border-amlbt-border bg-white", message.senderType === "system" && "mx-auto max-w-full border-orange-200 bg-amlbt-warning-soft text-center text-amlbt-warning", message.senderType === "moderator" && "border-purple-200 bg-purple-50")}>
            {message.senderName ? <div className="mb-1 text-[11px] font-semibold text-amlbt-text-muted">{message.senderName}</div> : null}
            <div>{message.body}</div>
            {message.attachmentName ? <div className="mt-2 rounded-lg border border-amlbt-border bg-white p-2 text-xs">📎 {message.attachmentName}</div> : null}
          </div>
        ))}
      </div>
      <div className="mt-2 flex h-11 items-center justify-between rounded-full border border-amlbt-border bg-white px-4 text-sm text-amlbt-text-muted">
        <span>Type message...</span><span>➤</span>
      </div>
    </div>
  );
}
