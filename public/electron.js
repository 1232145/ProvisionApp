const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

let win;
let autoSaveFilePath;
let backupSaveFilePath;

function hasMeaningfulData(data) {
  return !!(data && (data.Island || data.First_Name || data.Last_Name || data.Date_Time_Start));
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
  
  // Send the chosen autosave folder to the renderer once the page loads
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('autosave-folder-ready', {
      folder: path.dirname(autoSaveFilePath)
    });
  });

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
// Reads from the backup file so a cleared/empty live autosave never clobbers a good restore.
ipcMain.on("check-auto-save", () => {
  fs.readFile(backupSaveFilePath, "utf-8", (err, data) => {
    if (err) {
      console.log("[Main] No backup save found:", err.code);
      win.webContents.send("load-auto-save", null);
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      console.log("[Main] Loaded backup save successfully");
      win.webContents.send("load-auto-save", parsedData);
    } catch (parseError) {
      console.error("[Main] Error parsing backup save:", parseError);
      win.webContents.send("load-auto-save", null);
    }
  });
});

// Check if save file exists — reports on the backup file since that's what Load Save reads
ipcMain.on("check-save-file-exists", () => {
  fs.stat(backupSaveFilePath, (err, stats) => {
    if (err) {
      win.webContents.send("save-file-status", { exists: false, lastModified: null });
    } else {
      win.webContents.send("save-file-status", {
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
      win.webContents.send("save-file-result", false);
      return;
    }

    fs.writeFile(filePath, content, "utf-8", (err) => {
      if (err) {
        console.error("Error saving file:", err);
        win.webContents.send("save-file-result", false);
      } else {
        console.log("File saved:", filePath);
        win.webContents.send("save-file-result", true);
      }
    });
  } catch (error) {
    console.error("Error in save-file handler:", error);
    win.webContents.send("save-file-result", false);
  }
});

function atomicWrite(filePath, content, onSuccess) {
  const tmp = filePath + ".tmp";
  fs.writeFile(tmp, content, (writeErr) => {
    if (writeErr) { console.error(`[Main] Write error (${filePath}):`, writeErr); return; }
    fs.rename(tmp, filePath, (renameErr) => {
      if (renameErr) { console.error(`[Main] Rename error (${filePath}):`, renameErr); return; }
      if (onSuccess) onSuccess();
    });
  });
}

// Listen for saving data and save to auto-save file
ipcMain.on("autosave", (event, data) => {
  const saveData = data || {};
  const ts = new Date().toISOString();
  const json = JSON.stringify(saveData, null, 2);

  // Always write the live autosave (even if empty — reflects true current state)
  atomicWrite(autoSaveFilePath, json, () => {
    console.log(`[Main] Autosave written ✓ (${ts})`);
    win.webContents.send("save-file-status", { exists: true, lastModified: ts });
  });

  // Only update backup when data has meaningful content — protects against
  // empty-state overwrites (cleared form, fresh mount, etc.)
  if (hasMeaningfulData(saveData)) {
    atomicWrite(backupSaveFilePath, json, () => {
      console.log(`[Main] Backup updated ✓ (${ts})`);
    });
  } else {
    console.log(`[Main] Backup skipped — no meaningful data`);
  }
});

async function selectFolderAndCreateWindow() {
  const defaultPath = app.getPath('userData');
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Select Auto-save Folder',
    message: 'Choose a folder where your session data will be automatically saved',
    defaultPath: defaultPath,
    properties: ['openDirectory', 'createDirectory'],
    buttonLabel: 'Select Folder'
  });

  const folder = (!canceled && filePaths.length > 0) ? filePaths[0] : defaultPath;
  autoSaveFilePath  = path.join(folder, 'auto-save.json');
  backupSaveFilePath = path.join(folder, 'auto-save-backup.json');

  console.log(`Auto-save will be stored at: ${autoSaveFilePath}`);
  console.log(`Backup save will be stored at: ${backupSaveFilePath}`);
  createWindow();
}

app.whenReady().then(selectFolderAndCreateWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    selectFolderAndCreateWindow();
  }
});