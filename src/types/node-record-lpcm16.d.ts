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
