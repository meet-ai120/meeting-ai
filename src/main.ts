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
import recorder from "node-record-lpcm16";

const inDevelopment = process.env.NODE_ENV === "development";

// Store active recording instance
let systemAudioRecorder: any = null;

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
      media: true,
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

// Setup IPC handlers for system audio recording
ipcMain.handle("start-system-audio", async () => {
  try {
    if (systemAudioRecorder) {
      return { error: "Recording already in progress" };
    }

    systemAudioRecorder = recorder.record({
      sampleRate: 16000,
      channels: 1,
      audioType: "system",
    });

    const chunks: Buffer[] = [];

    systemAudioRecorder
      .stream()
      .on("data", (chunk: Buffer) => {
        chunks.push(chunk);
        // Send chunk to renderer every 5 seconds
        if (Buffer.concat(chunks).length >= 16000 * 2 * 5) {
          // 5 seconds of audio
          const audioBlob = Buffer.concat(chunks);
          BrowserWindow.getAllWindows()[0].webContents.send(
            "system-audio-data",
            audioBlob,
          );
          chunks.length = 0; // Clear chunks
        }
      })
      .on("error", (err: Error) => {
        console.error("System audio recording error:", err);
      });

    return { success: true };
  } catch (error) {
    console.error("Failed to start system audio recording:", error);
    return { error: "Failed to start system audio recording" };
  }
});

ipcMain.handle("stop-system-audio", () => {
  if (systemAudioRecorder) {
    systemAudioRecorder.stop();
    systemAudioRecorder = null;
    return { success: true };
  }
  return { error: "No recording in progress" };
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
