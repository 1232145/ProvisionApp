const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let autoSaveFilePath;

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
      nodeIntegration: true,
      contextIsolation: false,
    },
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

  let isClosing = false; // To track if the close is confirmed by the user

  win.on("close", (e) => {
    if (!isClosing) {
      e.preventDefault(); // Prevent the window from closing immediately
      sendToRenderer("warn-close"); // Send a warning to the renderer
    }
  });

  win.on("closed", () => {
    win = null;
  });

  // Listen for confirmation from the renderer to close the window
  ipcMain.on("confirm-close", () => {
    isClosing = true;
    win.close();
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
ipcMain.on("save-file", async (event, { content, fileName }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(win, {
      defaultPath: fileName,
      filters: [{ name: "CSV Files", extensions: ["csv"] }],
    });

    if (canceled || !filePath) {
      sendToRenderer("save-file-result", false);
      return;
    }

    fs.writeFile(filePath, content, "utf-8", (err) => {
      if (err) {
        console.error("Error saving file:", err);
        sendToRenderer("save-file-result", false);
      } else {
        console.log("File saved:", filePath);
        sendToRenderer("save-file-result", true);
      }
    });
  } catch (error) {
    console.error("Error in save-file handler:", error);
    sendToRenderer("save-file-result", false);
  }
});

// Save auto-save data and wait for real disk-write completion
ipcMain.handle("autosave", async (event, data) => {
  const saveData = data || {};

  try {
    console.log("[autosave] write start", autoSaveFilePath);
    await fs.promises.writeFile(
      autoSaveFilePath,
      JSON.stringify(saveData, null, 2),
      "utf-8"
    );

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