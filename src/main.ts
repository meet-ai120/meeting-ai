import {
  app,
  BrowserWindow,
  desktopCapturer,
  session,
  ipcMain,
} from "electron";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { Writable } from "stream";

const ffmpegPath = path.join(__dirname, "resources", "ffmpeg", "ffmpeg.exe"); // Path to the bundled FFmpeg binary

ffmpeg.setFfmpegPath(ffmpegPath); // Set the FFmpeg path for fluent-ffmpeg

const inDevelopment = process.env.NODE_ENV === "development";

let recording: ffmpeg.FfmpegCommand | null = null;
let outputPath: string | null = null;

ipcMain.handle("start-recording", async () => {
  if (recording) return;

  outputPath = path.join(
    app.getPath("downloads"),
    `recording-${Date.now()}.wav`,
  );

  recording = ffmpeg()
    .input("audio=Stereo Mix")
    .inputFormat("dshow")
    .audioCodec("pcm_s16le")
    .toFormat("wav")
    .on("end", () => {
      console.log("Recording finished");
    })
    .on("error", (err) => {
      console.error("Recording error:", err);
    });

  recording.save(outputPath);
});

ipcMain.handle("stop-recording", async () => {
  if (!recording || !outputPath) return "";

  return new Promise<string>((resolve) => {
    recording!.on("end", () => {
      resolve(outputPath!);
      recording = null;
      outputPath = null;
    });

    recording!.kill("SIGTERM");
  });
});

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,
      preload: preload,
    },
    titleBarStyle: "hidden",
  });

  mainWindow.webContents.openDevTools();

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

app.whenReady().then(() => {
  console.log("READY");
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === "media") {
        callback(true); // Allow media access
      } else {
        callback(false);
      }
    },
  );
  // session.defaultSession.setDisplayMediaRequestHandler(
  //   (request, callback) => {
  //     console.log("DISPLAY MEDIA REQUEST", request);
  //     desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
  //       // Grant access to the first screen found.
  //       callback({ video: sources[0], audio: "loopback" });
  //     });
  //     // If true, use the system picker if available.
  //     // Note: this is currently experimental. If the system picker
  //     // is available, it will be used and the media request handler
  //     // will not be invoked.
  //   },
  //   { useSystemPicker: true },
  // );
  createWindow();
});

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends
