import React, { useState } from "react";
import { Button } from "./ui/button";

declare global {
  interface Window {
    electronAPI: {
      startRecording: () => Promise<void>;
      stopRecording: () => Promise<string>;
    };
  }
}

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      await window.electronAPI.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = async () => {
    try {
      const outputPath = await window.electronAPI.stopRecording();
      setIsRecording(false);
      if (outputPath) {
        console.log("Recording saved to:", outputPath);
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {!isRecording ? (
        <Button onClick={startRecording} variant="default">
          Start Recording
        </Button>
      ) : (
        <Button onClick={stopRecording} variant="destructive">
          Stop Recording
        </Button>
      )}
    </div>
  );
}
