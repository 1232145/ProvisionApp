const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let autoSaveFilePath;
let isClosing = false;

function sendToRenderer(channel, payload) {
  if (!win || win.isDestroyed()) return;
  if (!win.webContents || win.webContents.isDestroyed()) return;
  win.webContents.send(channel, payload);
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Keep the packaged renderer on a strict local-only policy. This also
  // removes Electron's warning about a missing Content-Security-Policy.
  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...(details.responseHeaders || {}) };
    responseHeaders['Content-Security-Policy'] = [contentSecurityPolicy];
    callback({ responseHeaders });
  });

  // Load the React app (build version)
  // In packaged app, electron.js is in build/, so __dirname is build/
  // In development, electron.js is in public/, so we need ../build
  let dir = __dirname.includes("app.asar") || __dirname.endsWith("build") 
    ? __dirname 
    : path.join(__dirname, "../build");
  win.loadFile(path.join(dir, "index.html"));
  
  // Use userData so writes succeed in packaged builds (app.asar is read-only)
  autoSaveFilePath = path.join(app.getPath('userData'), "auto-save.json");
  console.log(`Auto-save will be stored at: ${autoSaveFilePath}`);

  // win.webContents.openDevTools();

  isClosing = false;

  win.on("close", (e) => {
    if (!isClosing) {
      e.preventDefault(); // Prevent the window from closing immediately
      sendToRenderer("warn-close"); // Send a warning to the renderer
    }
  });

  win.on("closed", () => {
    win = null;
  });

}

// Check if auto-save exists and send it to the renderer (React)
ipcMain.on("check-auto-save", () => {
  console.log("[autosave] check-auto-save requested", autoSaveFilePath);
  fs.readFile(autoSaveFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("No auto-save file found or error reading the file:", err);
      // Send null if no auto-save exists
      sendToRenderer("load-auto-save", null);
      return;
    }

    try {
      // Try to parse JSON content
      const parsedData = JSON.parse(data);
      // Send the saved data to the React app
      sendToRenderer("load-auto-save", parsedData);
    } catch (parseError) {
      // Handle JSON parse error (file is not valid JSON)
      console.error("Error parsing auto-save file:", parseError);
      // Send null if JSON is invalid
      sendToRenderer("load-auto-save", null);
    }
  });
});

// Check if save file exists and get its timestamp
ipcMain.on("check-save-file-exists", () => {
  fs.stat(autoSaveFilePath, (err, stats) => {
    if (err) {
      // File doesn't exist
      sendToRenderer("save-file-status", { exists: false, lastModified: null });
    } else {
      // File exists, send its modification time
      sendToRenderer("save-file-status", { 
        exists: true, 
        lastModified: stats.mtime.toISOString() 
      });
    }
  });
});

// Listen for CSV file save requests - opens a native save dialog
ipcMain.handle("save-file", async (_event, { content, fileName }) => {
  try {
    if (typeof content !== "string" || typeof fileName !== "string" || !fileName.trim()) {
      throw new Error("Invalid file save request");
    }

    const safeFileName = path.basename(fileName);
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: safeFileName,
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });

    if (canceled || !filePath) {
      return { success: false, canceled: true };
    }

    await fs.promises.writeFile(filePath, content, "utf-8");
    console.log("File saved:", filePath);
    return { success: true, filePath };
  } catch (error) {
    console.error("Error in save-file handler:", error);
    return { success: false, error: error.message || "Unable to save file" };
  }
});

// Listen for confirmation from the renderer to close the window.
ipcMain.on("confirm-close", () => {
  isClosing = true;
  if (win && !win.isDestroyed()) win.close();
});

// Save auto-save data and wait for real disk-write completion
ipcMain.handle("autosave", async (event, data) => {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { success: false, error: "Invalid autosave payload" };
  }
  const saveData = data;

  try {
    console.log("[autosave] write start", autoSaveFilePath);
    const temporaryPath = `${autoSaveFilePath}.tmp`;
    await fs.promises.writeFile(
      temporaryPath,
      JSON.stringify(saveData, null, 2),
      "utf-8"
    );
    await fs.promises.rename(temporaryPath, autoSaveFilePath);

    const lastModified = new Date().toISOString();
    console.log("[autosave] write success", lastModified);
    sendToRenderer("save-file-status", {
      exists: true,
      lastModified,
    });

    return { success: true, lastModified };
  } catch (err) {
    console.error("Error saving auto-save:", err);
    return { success: false, error: err.message || "Unknown autosave error" };
  }
});

app.whenReady().then(createWindow);

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
