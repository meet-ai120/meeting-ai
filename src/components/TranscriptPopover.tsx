import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Download, Mic, Square } from "lucide-react";
import { sendAudio, sendToCorrection } from "@/lib/server";
import { supabase } from "@/lib/supabase";
// const messages = [
//   "The funny thing is I didn't unfollow Elon at all. ",
//   "One of the headlines was that Marques and Elon unfollowed each other on Twitter. I woke up to find that my account had unfollowed. What? What I assume happened was you know, how you can, like, block and unblock sort of soft unfollow so they don't know that they unfollow you? Does that force them to unfollow you? Yeah. If you block someone, they can't follow you anymore. ",
//   "So if you, like, block them and unblock them, they'll stop seeing your stuff. Wait. So are art did he block you? So I was following you. He tweets a ton, and I I don't really have any, like, political follows. I follow people who I wanna their stuff, and I don't follow people who I don't wanna see their stuff. Elon is tweeting a lot. I don't know if you noticed. It's I did. It was getting closer. I was like, do I mute him? I still wanna see, like, the important stuff, but there's just too much stuff now. When I saw that, I was like, wait. Yeah. I just realized I haven't seen any El Ensemble. ",
//   "Summer Time Line in, like, a couple of days. So I assume he, like, did something, either block and unblocked or, like, funny thing is I didn't unfollow Elon at all. One of the headlines It that Marques and Elon unfollowed each other on Twitter. I woke up to find that ",
// ];

// const messages = SAMPLE_TRANSCRIPT;

declare global {
  interface Window {
    systemAudio: {
      startRecording: () => Promise<{ success?: boolean; error?: string }>;
      stopRecording: () => Promise<{ success?: boolean; error?: string }>;
      onData: (callback: (data: Buffer) => void) => void;
      removeDataListener: (callback: (data: Buffer) => void) => void;
    };
  }
}

interface TranscriptPopoverProps {
  meetingId: number;
  onEnhance: () => void;
  transcript: string;
  // Use state update function
  setTranscript: (callback: (prev: string) => string) => void;
}

export default function TranscriptPopover({
  meetingId,
  onEnhance,
  transcript,
  setTranscript,
}: TranscriptPopoverProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (transcript) {
        await supabase
          .from("meeting")
          .update({ transcript: transcript })
          .eq("id", meetingId);
      }
    })();
  }, [transcript, meetingId]);

  const handleSystemAudioData = async (data: Buffer) => {
    const blob = new Blob([data], { type: "audio/wav" });
    const audioFile = new File(
      [blob],
      `system-audio-${new Date().getTime()}.wav`,
      {
        type: "audio/wav",
      },
    );

    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await sendAudio(formData);
    const responseData = await response.data;

    setTranscript((prev) => {
      if (!isRecordingRef.current) {
        handleCorrection(prev + responseData.text);
      }
      return prev + responseData.text;
    });
  };

  const handleRecord = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isRecording) {
      stop();
    } else {
      await record();
    }
  };

  const record = async () => {
    setIsRecording(true);
    isRecordingRef.current = true;

    // Start system audio recording
    const systemResult = await window.systemAudio.startRecording();
    if (systemResult.error) {
      console.error("Failed to start system audio:", systemResult.error);
    } else {
      window.systemAudio.onData(handleSystemAudioData);
    }

    // Start microphone recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          sendToTranscribe(event.data);
        }
      };

      mediaRecorder.start();
      intervalRef.current = setInterval(() => {
        mediaRecorder.requestData();
        mediaRecorder.stop();
        mediaRecorder.start();
      }, 5000);
    } catch (error) {
      alert(
        "Microphone access is required. Please enable it in system settings.",
      );
      console.error("Error capturing audio:", error);
      setIsRecording(false);
    }
  };

  const stop = async () => {
    setIsRecording(false);
    isRecordingRef.current = false;

    // Stop system audio recording
    await window.systemAudio.stopRecording();

    // Stop microphone recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.requestData();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const sendToTranscribe = async (blob: Blob) => {
    console.log("SENDING TO TRANSCRIBE");
    const newBlob = new Blob([blob], {
      type: "audio/webm; codecs=opus",
    });
    const audioFile = new File(
      [newBlob],
      `audio-${new Date().getTime()}.webm`,
      {
        type: "audio/webm",
      },
    );

    const formData = new FormData();
    formData.append("audio", audioFile);

    const response = await sendAudio(formData);
    const data = await response.data;
    console.log("Is recording", isRecordingRef.current);
    setTranscript((prev) => {
      if (!isRecordingRef.current) {
        handleCorrection(prev + data.text);
      }
      return prev + data.text;
    });
  };

  const handleCorrection = async (transcript: string) => {
    console.log("Sending to correction");
    const response = await sendToCorrection(transcript);
    const text = await response.data.response;
    setTranscript((prev) => text);
  };

  // Clean up system audio listener on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stop();
      }
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRecord}
            variant={isRecording ? "destructive" : undefined}
            size="icon"
          >
            {isRecording ? (
              <Square className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline">Transcript</Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEnhance();
            }}
          >
            Enhance
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex h-[500px] w-[450px] flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between p-2 px-4">
          <span className="text-lg font-bold">Transcript</span>
          <Button variant="outline">
            <Download />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-2 px-4 pt-1">
            <div className="flex flex-col gap-2">
              {transcript
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <div
                    key={index}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-black"
                  >
                    {paragraph}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
