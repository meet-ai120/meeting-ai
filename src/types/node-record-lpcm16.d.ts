declare module "node-record-lpcm16" {
  interface RecordOptions {
    sampleRate?: number;
    channels?: number;
    audioType?: "mic" | "system";
    [key: string]: any;
  }

  interface Recorder {
    record(options?: RecordOptions): RecorderInstance;
  }

  interface RecorderInstance {
    stream(): NodeJS.ReadableStream;
    stop(): void;
  }

  const recorder: Recorder;
  export default recorder;
}
