import { Meeting } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { AIVoiceInput } from "@/components/VoiceInput";
import { Chat } from "@/components/Chat";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = params.meetingId;

  return (
    <div className="flex h-full w-full">
      {/* Notes area */}
      <div className="w-2/3 border-4 border-black bg-gray-200"></div>
      <div className="w-1/3 border-4 border-black">
        <Chat />
      </div>
    </div>
  );
}
