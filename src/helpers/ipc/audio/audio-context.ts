import { ipcMain } from "electron";
import recorder from "node-record-lpcm16";

declare module "node-record-lpcm16" {
  interface RecorderInstance {
    stop: () => void;
    stream: () => NodeJS.ReadableStream;
  }

  interface RecorderOptions {
    sampleRate: number;
    channels: number;
    audioType: string;
    threshold: number;
  }

  interface Recorder {
    record: (options: RecorderOptions) => RecorderInstance;
  }

  const recorder: Recorder;
  export default recorder;
}

let systemAudioRecorder: ReturnType<typeof recorder.record> | null = null;

export function exposeAudioContext() {
  ipcMain.on("start-system-audio-recording", (event) => {
    if (systemAudioRecorder) return;

    try {
      systemAudioRecorder = recorder
        .record({
          sampleRate: 16000,
          channels: 1,
          audioType: "wav",
          threshold: 0.5,
        })
        .stream()
        .on("data", (chunk: Buffer) => {
          // Send chunks to renderer process
          event.sender.send("system-audio-data", chunk);
        })
        .on("error", (err: Error) => {
          console.error("Recording error:", err);
          event.sender.send("system-audio-error", err.message);
          stopRecording();
        });
    } catch (error) {
      console.error("Failed to start system audio recording:", error);
      if (error instanceof Error) {
        event.sender.send("system-audio-error", error.message);
      } else {
        event.sender.send("system-audio-error", "Unknown error occurred");
      }
    }
  });

  ipcMain.on("stop-system-audio-recording", () => {
    stopRecording();
  });
}

function stopRecording() {
  if (systemAudioRecorder) {
    systemAudioRecorder.stop();
    systemAudioRecorder = null;
  }
}
