const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let autoSaveFilePath;

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
  
  // Set auto-save path in the same directory as the app for easy access
  autoSaveFilePath = path.join(dir, "auto-save.json");
  console.log(`Auto-save will be stored at: ${autoSaveFilePath}`);

  // win.webContents.openDevTools();

  let isClosing = false; // To track if the close is confirmed by the user

  win.on("close", (e) => {
    if (!isClosing) {
      e.preventDefault(); // Prevent the window from closing immediately
      win.webContents.send("warn-close"); // Send a warning to the renderer
    }
  });

  // Listen for confirmation from the renderer to close the window
  ipcMain.on("confirm-close", () => {
    isClosing = true;
    win.close();
  });
}

// Check if auto-save exists and send it to the renderer (React)
ipcMain.on("check-auto-save", () => {
  fs.readFile(autoSaveFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("No auto-save file found or error reading the file:", err);
      // Send null if no auto-save exists
      win.webContents.send("load-auto-save", null);
      return;
    }

    try {
      // Try to parse JSON content
      const parsedData = JSON.parse(data);
      // Send the saved data to the React app
      win.webContents.send("load-auto-save", parsedData);
    } catch (parseError) {
      // Handle JSON parse error (file is not valid JSON)
      console.error("Error parsing auto-save file:", parseError);
      // Send null if JSON is invalid
      win.webContents.send("load-auto-save", null);
    }
  });
});

// Check if save file exists and get its timestamp
ipcMain.on("check-save-file-exists", () => {
  fs.stat(autoSaveFilePath, (err, stats) => {
    if (err) {
      // File doesn't exist
      win.webContents.send("save-file-status", { exists: false, lastModified: null });
    } else {
      // File exists, send its modification time
      win.webContents.send("save-file-status", { 
        exists: true, 
        lastModified: stats.mtime.toISOString() 
      });
    }
  });
});

// Listen for saving data and save to auto-save file
ipcMain.on("autosave", (event, data) => {
  // Ensure data is an object before saving, or initialize it as an empty object
  const saveData = data || {};

  fs.writeFile(autoSaveFilePath, JSON.stringify(saveData, null, 2), (err) => {
    if (err) {
      console.error("Error saving auto-save:", err);
    } else {
      console.log("Auto-save updated");
      // Update the save file status after successful save
      win.webContents.send("save-file-status", { 
        exists: true, 
        lastModified: new Date().toISOString() 
      });
    }
  });
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