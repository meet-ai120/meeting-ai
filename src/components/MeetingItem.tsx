import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { formatDate, formatFullDateTime } from "@/lib/format";
import { Meeting, supabase } from "@/lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Loader2, MoreHorizontal, MoreVertical, Trash } from "lucide-react";
import { useDeleteMeeting } from "@/lib/queries";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function MeetingItem({ meeting }: { meeting: Meeting }) {
  const navigate = useNavigate();
  const deleteMutation = useDeleteMeeting();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        navigate({
          to: "/meeting/$meetingId",
          params: { meetingId: meeting.id.toString() },
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate({
            to: "/meeting/$meetingId",
            params: { meetingId: meeting.id.toString() },
          });
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
      )}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="line-clamp-1 font-semibold">{meeting.title}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs">
                  {formatDate(meeting.created_at)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formatFullDateTime(meeting.created_at)}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-input bg-transparent p-0 hover:bg-accent disabled:opacity-50"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                  <span className="sr-only">Open menu</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive hover:text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(meeting.id);
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* <div className="text-xs font-medium">{meeting.description}</div> */}
      </div>
      <div className="line-clamp-3 text-xs text-muted-foreground">
        {meeting.description}
      </div>

      {/* <div className="flex items-center gap-2">
        {["meeting", "important", "personal"].map((label, index) => (
          <Badge
            key={label}
            // @ts-expect-error
            variant={["default", "outline", "secondary"][index]}
          >
            {label}
          </Badge>
        ))}
      </div> */}
    </div>
  );
}
