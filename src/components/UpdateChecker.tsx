import React from "react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    ipcRenderer.on("update_available", () => {
      setUpdateAvailable(true);
    });

    ipcRenderer.on("update_downloaded", () => {
      setUpdateAvailable(true);
    });

    return () => {
      ipcRenderer.removeAllListeners("update_available");
      ipcRenderer.removeAllListeners("update_downloaded");
    };
  }, []);

  const handleUpdate = () => {
    ipcRenderer.send("restart_app");
  };

  return updateAvailable ? (
    <button onClick={handleUpdate}>Update Available! Click to Restart</button>
  ) : null;
}
