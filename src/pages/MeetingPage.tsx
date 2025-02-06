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
import { QUERY_KEYS, queryClient, useMeeting } from "@/lib/queries";
import { getTitle, sendTextPrompt } from "@/lib/server";
import { useAppContext } from "@/store/AppContext";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = Number(params.meetingId);
  const editorRef = useRef<Editor | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { updateState } = useAppContext();
  const [streamingContent, setStreamingContent] = useState("");

  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      updateState({ isLoading: true });

      const { data, error } = await supabase
        .from("meeting")
        .select("*")
        .eq("id", meetingId)
        .single();

      if (error) {
        console.error("Error fetching meeting", error);
      } else {
        setCurrentMeeting(data);
      }
      editorRef.current?.commands.setContent(data?.notes || "");
      updateState({ isLoading: false });
    };

    fetchMeeting();
  }, [meetingId]);

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
    // @ts-ignore
    setCurrentMeeting((prev) => ({ ...prev, notes: note }));
    debouncedUpdateNote(note);
  };

  const handleEnhance = async () => {
    if (!currentMeeting) return;
    setIsEnhancing(true);
    setStreamingContent("");
    console.log("NOTE FOR ENHANCE", currentMeeting.notes);

    try {
      const res = await sendTextPrompt(
        {
          meeting: currentMeeting,
          type: "summary",
          note: currentMeeting.notes?.toString() || "",
          chatQuestion: "",
        },
        (chunk) => {
          setStreamingContent((prev) => {
            const newContent = prev + chunk;
            editorRef.current?.commands.setContent(newContent);
            return newContent;
          });
        },
      );

      // After streaming is complete, update the meeting with the final content
      if (res.data.response) {
        setCurrentMeeting((prev) =>
          prev ? { ...prev, notes: res.data.response } : null,
        );
        debouncedUpdateNote(res.data.response);
        handleGetMeetingInfo(res.data.response).then(() => {});
      }
    } catch (error) {
      console.error("Error during enhancement:", error);
      // Optionally handle error UI feedback here
    } finally {
      setIsEnhancing(false);
      setStreamingContent("");
    }
  };

  const handleGetMeetingInfo = async (notes?: string) => {
    console.log("GETTING MEETING INFO", currentMeeting);
    if (!currentMeeting) return;
    const res = await getTitle(
      currentMeeting.transcript || "",
      notes || currentMeeting?.notes || "",
      currentMeeting.title || "",
      currentMeeting.description || "",
    );
    const data = res.data;
    setCurrentMeeting((prev) =>
      prev
        ? { ...prev, title: res.data.title, description: res.data.description }
        : null,
    );
    await supabase
      .from("meeting")
      .update({ title: res.data.title, description: res.data.description })
      .eq("id", meetingId);
  };

  useEffect(() => {
    if (currentMeeting) {
      updateState({ title: currentMeeting.title || "" });
    }
    return () => {
      updateState({ title: "" });
    };
  }, [currentMeeting]);

  // useEffect(() => {
  //   console.log("MeetingPage MOUNTING");
  //   return () => {
  //     console.log("UNMOUNTING", currentMeeting);
  //     if (currentMeeting) {
  //       handleGetMeetingInfo().then(() => {});
  //     }
  //   };
  // }, [currentMeeting]);

  return (
    <div className="flex h-full w-full">
      <div className="relative flex w-2/3 flex-col overflow-hidden bg-gray-100">
        <MinimalTiptapEditor
          editorRef={editorRef}
          value={currentMeeting?.notes}
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
          <TranscriptPopover
            transcript={currentMeeting?.transcript || ""}
            setTranscript={(callback) => {
              setCurrentMeeting((prev) =>
                prev
                  ? { ...prev, transcript: callback(prev.transcript || "") }
                  : null,
              );
            }}
            onEnhance={handleEnhance}
            meetingId={meetingId}
          />
        </div>
      </div>
      <div className="w-1/3 border-l">
        <Chat
          meeting={currentMeeting}
          chatHistory={
            (currentMeeting?.chat_history
              ? JSON.parse(currentMeeting.chat_history as string)
              : []) as ChatItem[]
          }
        />
      </div>
    </div>
  );
}
