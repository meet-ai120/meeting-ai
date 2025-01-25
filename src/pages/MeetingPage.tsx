import { ChatItem, Meeting, sendTextPrompt } from "@/lib/supabase";
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
import { QUERY_KEYS, queryClient, useMeeting } from "@/lib/queries";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = Number(params.meetingId);
  const [note, setNote] = useState<Content>("");
  const meeting = useMeeting(meetingId);
  const editorRef = useRef<Editor | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  console.log("meeting", meeting.data?.data);

  useEffect(() => {
    if (meeting.data?.data && editorRef.current && note === "") {
      editorRef.current.commands.setContent(meeting.data.data.notes);
      setNote(meeting.data.data.notes);
    }
  }, [meeting.data?.data]);

  const debouncedUpdateNote = useRef(
    debounce(async (note: Content) => {
      console.log("Updating supabase", note);
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
  console.log("note", note);

  const handleEnhance = async () => {
    if (!meeting.data?.data) return;
    setIsEnhancing(true);
    console.log("NOTE FOR ENHANCE", note);
    const res = await sendTextPrompt({
      meeting: meeting.data?.data,
      type: "summary",
      note: note?.toString() || "",
      chatQuestion: "",
    });
    const response = res.data.response;
    if (response) {
      editorRef.current?.commands.setContent(response);
      setNote(meeting.data.data.notes);
      debouncedUpdateNote(response);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.meeting, meetingId],
      });
    }
    setIsEnhancing(false);
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
          disabled={isEnhancing}
        />
        <div className="absolute bottom-[30px] left-1/2 -translate-x-1/2">
          <TranscriptPopover onEnhance={handleEnhance} meetingId={meetingId} />
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
