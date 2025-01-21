import { Meeting } from "@/lib/supabase";
import { Link, useParams } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { MeetingRoute } from "@/routes/routes";
import { AIVoiceInput } from "@/components/VoiceInput";

export default function MeetingPage() {
  const params = MeetingRoute.useParams();
  const meetingId = params.meetingId;
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const { data, error } = await supabase
          .from("meeting")
          .select("*")
          .eq("id", meetingId)
          .single();

        if (error) throw error;
        setMeeting(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch meeting",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchMeeting();
  }, [meetingId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!meeting) return <div>Meeting not found</div>;

  const record = () => {
    setRecordedChunks([]);
    setIsRecording(true);

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.start(1000);
      })
      .catch((error) => {
        console.error("Error capturing audio:", error);
        setIsRecording(false);
      });
  };

  const stop = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      setIsRecording(false);
      mediaRecorderRef.current.requestData();

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: "audio/webm; codecs=opus",
        });

        blob.arrayBuffer().then((buffer) => {
          window.Electron.ipcRenderer.send("save-recording", buffer);
          setRecordedChunks([]);
        });
      };

      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  return (
    <div className="h-screen">
      <Link to="/">Go back</Link>
      <h1>{meeting.title}</h1>
      {/* Add more meeting details here */}
      <AIVoiceInput className="absolute bottom-0 left-0 right-0" />
    </div>
  );
}
