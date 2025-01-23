import { ChatItem, Meeting } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { AIVoiceInput } from "@/components/VoiceInput";
import { Chat } from "@/components/Chat";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content, Editor } from "@tiptap/react";
import TranscriptPopover from "@/components/TranscriptPopover";
import debounce from "lodash.debounce";
import { useMeeting } from "@/lib/queries";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = Number(params.meetingId);
  const [note, setNote] = useState<Content>("");
  const meeting = useMeeting(meetingId);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    if (meeting.data?.data && editorRef.current) {
      editorRef.current.commands.setContent(meeting.data.data.notes);
    }
  }, [meeting.data?.data]);

  const debouncedUpdateNote = useRef(
    debounce(async (note: Content) => {
      await supabase
        .from("meeting")
        .update({
          notes: note?.toString(),
        })
        .eq("id", meetingId);
    }, 1000),
  ).current;

  const handleUpdateNote = async (note: Content) => {
    setNote(note);
    debouncedUpdateNote(note);
  };

  return (
    <div className="flex h-full w-full">
      <div className="relative flex w-2/3 flex-col overflow-hidden bg-gray-100">
        <MinimalTiptapEditor
          editorRef={editorRef}
          value={note}
          onChange={handleUpdateNote}
          className="flex h-full w-full flex-col overflow-hidden"
          editorContentClassName="p-5 overflow-y-auto"
          output="html"
          placeholder="Type your description here..."
          autofocus={true}
          editable={true}
        />
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2">
          <TranscriptPopover meetingId={"5"} />
        </div>
      </div>
      <div className="w-1/3 border-l">
        <Chat
          meeting={meeting.data?.data}
          chatHistory={
            (meeting.data?.data?.chat_history
              ? JSON.parse(meeting.data?.data?.chat_history as string)
              : []) as ChatItem[]
          }
        />
      </div>
    </div>
  );
}
