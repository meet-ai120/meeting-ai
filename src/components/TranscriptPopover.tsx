import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Download, Mic, Square, Monitor } from "lucide-react";
import { sendAudio, sendToCorrection } from "@/lib/server";
import { supabase, TranscriptItem } from "@/lib/supabase";
import { MicVAD, utils } from "@ricky0123/vad-web";
import { cn } from "@/lib/utils";
// const messages = [
//   "The funny thing is I didn't unfollow Elon at all. ",
//   "One of the headlines was that Marques and Elon unfollowed each other on Twitter. I woke up to find that my account had unfollowed. What? What I assume happened was you know, how you can, like, block and unblock sort of soft unfollow so they don't know that they unfollow you? Does that force them to unfollow you? Yeah. If you block someone, they can't follow you anymore. ",
//   "So if you, like, block them and unblock them, they'll stop seeing your stuff. Wait. So are art did he block you? So I was following you. He tweets a ton, and I I don't really have any, like, political follows. I follow people who I wanna their stuff, and I don't follow people who I don't wanna see their stuff. Elon is tweeting a lot. I don't know if you noticed. It's I did. It was getting closer. I was like, do I mute him? I still wanna see, like, the important stuff, but there's just too much stuff now. When I saw that, I was like, wait. Yeah. I just realized I haven't seen any El Ensemble. ",
//   "Summer Time Line in, like, a couple of days. So I assume he, like, did something, either block and unblocked or, like, funny thing is I didn't unfollow Elon at all. One of the headlines It that Marques and Elon unfollowed each other on Twitter. I woke up to find that ",
// ];

// const messages = SAMPLE_TRANSCRIPT;
const VAD_CONFIG = {
  redemptionFrames: 6,
  // positiveSpeechThreshold: 0.8,
  // negativeSpeechThreshold: 0.5,
  // minSpeechFrames: 2,
};

interface TranscriptPopoverProps {
  meetingId: number;
  onEnhance: () => void;
  transcript: TranscriptItem[];
  // Use state update function
  setTranscript: (
    callback: (prev: TranscriptItem[]) => TranscriptItem[],
  ) => void;
}

export default function TranscriptPopover({
  meetingId,
  onEnhance,
  transcript,
  setTranscript,
}: TranscriptPopoverProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const isRecordingRef = useRef(false);
  const vadRef = useRef<MicVAD | null>(null);
  const screenVadRef = useRef<MicVAD | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      if (transcript.length > 2) {
        await supabase
          .from("meeting")
          .update({ transcript: JSON.stringify(transcript) })
          .eq("id", meetingId);
      }
    })();
  }, [transcript, meetingId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [transcript]);

  const handleRecord = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      // Start microphone recording
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      micStreamRef.current = micStream;

      const micRecorder = new MediaRecorder(micStream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = micRecorder;

      const myvad = await MicVAD.new({
        stream: micStream,
        onSpeechEnd: async (audio) => {
          console.log("Mic speech ended");
          const wavBuffer = utils.encodeWAV(audio);
          const webmBlob = new Blob([wavBuffer], { type: "audio/webm" });
          sendToTranscribe(webmBlob, Date.now(), "mic");
        },
        onSpeechStart: () => {
          console.log("Mic speech started");
        },
        ...VAD_CONFIG,
      });
      vadRef.current = myvad;
      myvad.start();

      // Start screen audio recording
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = screenStream;

      const audioStream = new MediaStream(screenStream.getAudioTracks());
      const screenRecorder = new MediaRecorder(audioStream, {
        mimeType: "audio/webm",
      });
      screenRecorderRef.current = screenRecorder;

      const screenVad = await MicVAD.new({
        stream: audioStream,
        onSpeechEnd: async (audio) => {
          console.log("Screen speech ended");
          const wavBuffer = utils.encodeWAV(audio);
          const webmBlob = new Blob([wavBuffer], { type: "audio/webm" });
          sendToTranscribe(webmBlob, Date.now(), "screen");
        },
        onSpeechStart: () => {
          console.log("Screen speech started");
        },
        ...VAD_CONFIG,
      });
      screenVadRef.current = screenVad;
      screenVad.start();

      // Stop video tracks since we don't need them
      screenStream.getVideoTracks().forEach((track) => track.stop());

      setIsRecording(true);
      isRecordingRef.current = true;
    } catch (error) {
      console.error("Error starting recording:", error);
      alert(
        "Microphone and screen audio access are required. Please enable them in system settings.",
      );
      setIsRecording(false);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    // Stop VAD instances
    if (vadRef.current) {
      vadRef.current.destroy();
      vadRef.current = null;
    }
    if (screenVadRef.current) {
      screenVadRef.current.destroy();
      screenVadRef.current = null;
    }

    // Stop microphone recording and tracks
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      micStreamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    // Stop screen recording and tracks
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      screenStreamRef.current = null;
    }
    if (screenRecorderRef.current) {
      if (screenRecorderRef.current.state !== "inactive") {
        screenRecorderRef.current.stop();
      }
      screenRecorderRef.current = null;
    }

    setIsRecording(false);
    isRecordingRef.current = false;
  };

  const sendToTranscribe = async (
    blob: Blob,
    timestamp: number,
    source: TranscriptItem["source"],
  ) => {
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
      return [
        ...prev,
        {
          content: data.text,
          source,
          timestamp,
        },
      ];
    });
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const handleCorrection = async (transcript: string) => {
    console.log("Sending to correction");
    const response = await sendToCorrection(transcript);
    const text = await response.data.response;
    // setTranscript((prev) => text);
  };
  console.log("TRANSCRIPT", transcript);

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
            <div className="flex w-full flex-col gap-2">
              {transcript.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full",
                    item.source === "mic" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "w-fit max-w-[80%] break-words rounded-lg px-3 py-2 text-sm",
                      item.source === "mic"
                        ? "ml-auto rounded-br-none bg-primary text-primary-foreground"
                        : "rounded-bl-none bg-muted",
                    )}
                  >
                    {item.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
