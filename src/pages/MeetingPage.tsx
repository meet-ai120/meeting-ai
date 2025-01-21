import { Meeting } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { AIVoiceInput } from "@/components/VoiceInput";
import { Chat } from "@/components/Chat";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Content } from "@tiptap/react";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = params.meetingId;
  const [value, setValue] = useState<Content>("");

  return (
    <div className="flex h-full w-full">
      {/* Notes area */}
      <div className="flex w-2/3 flex-col overflow-hidden bg-gray-100">
        <MinimalTiptapEditor
          value={value}
          onChange={setValue}
          className="flex h-full w-full flex-col overflow-hidden"
          editorContentClassName="p-5 overflow-y-auto"
          output="json"
          placeholder="Type your description here..."
          autofocus={true}
          editable={true}
          editorClassName=""
        />
      </div>
      <div className="w-1/3 border-l">
        <Chat />
      </div>
    </div>
  );
}
