import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/format";
import { Meeting } from "@/lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { useNavigate } from "@tanstack/react-router";

export function MeetingItem({ meeting }: { meeting: Meeting }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        navigate({
          to: "/meeting/$meetingId",
          params: { meetingId: meeting.id.toString() },
        });
      }}
      className={cn(
        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{meeting.title}</div>
          </div>
          <div className={"ml-auto text-xs"}>
            {formatDate(meeting.created_at)}
          </div>
        </div>
        {/* <div className="text-xs font-medium">{meeting.description}</div> */}
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        {meeting.description.substring(0, 300)}
      </div>

      <div className="flex items-center gap-2">
        {["meeting", "important", "personal"].map((label, index) => (
          <Badge
            key={label}
            // @ts-expect-error
            variant={["default", "outline", "secondary"][index]}
          >
            {label}
          </Badge>
        ))}
      </div>
    </button>
  );
}
