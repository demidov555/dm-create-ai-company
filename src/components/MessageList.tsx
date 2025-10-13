import { Bot, User } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";

interface Message {
  id: string;
  sender: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <Card className="border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm text-foreground">История коммуникаций</h3>
      </div>
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary/10"
                    : "bg-secondary"
                } shrink-0`}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary" />
                ) : (
                  <Bot className="h-4 w-4 text-foreground" />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-foreground">
                    {message.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 bg-secondary/50 rounded-lg p-3 inline-block max-w-[80%]">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
