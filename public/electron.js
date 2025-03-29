const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
let autoSaveFilePath;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // Load the React app (build version)
  let dir = `${path.join(__dirname, '../build')}`;

  win.loadFile(`${dir}/index.html`);
  autoSaveFilePath = path.join(`${dir}/auto-save.json`);

  win.webContents.openDevTools();

  promptForAutoSaveDirectory();

  function promptForAutoSaveDirectory() {
    // Check if the auto-save file path already exists (to determine if the user has already selected a directory)
    if (!fs.existsSync(autoSaveFilePath)) {
      dialog.showOpenDialog(win, {
        properties: ['openDirectory'],
        title: 'Select a Directory to Save Auto-Save File', // Added title for better user experience
        buttonLabel: 'Select Folder', // Customize the button label
      }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
          // Set the directory path for saving the auto-save file
          autoSaveFilePath = path.join(result.filePaths[0], 'auto-save.json');
          console.log(`Auto-save directory set to: ${autoSaveFilePath}`);
        } else {
          console.log('No directory selected for auto-save.');
        }
      }).catch(err => {
        console.error('Error selecting directory:', err);
      });
    }
  }

  let isClosing = false; // To track if the close is confirmed by the user

  win.on('close', (e) => {
    if (!isClosing) {
      e.preventDefault(); // Prevent the default close behavior
      win.webContents.send('warn-close'); // Show the close confirmation in React

      // Listen for user confirmation to close
      ipcMain.once('confirm-close', () => {
        isClosing = true; // Mark as confirmed
        win.close(); // Now close the window
      });
    } else {
      // Allow close if confirmed
      win.close();
    }
  });
}

// Check if auto-save exists and send it to the renderer (React)
ipcMain.on('check-auto-save', () => {
  fs.readFile(autoSaveFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('No auto-save file found or error reading the file:', err);
      // Send null if no auto-save exists
      win.webContents.send('load-auto-save', null);
      return;
    }

    try {
      // Try to parse JSON content
      const parsedData = JSON.parse(data);
      // Send the saved data to the React app
      win.webContents.send('load-auto-save', parsedData);
    } catch (parseError) {
      // Handle JSON parse error (file is not valid JSON)
      console.error('Error parsing auto-save file:', parseError);
      // Send null if JSON is invalid
      win.webContents.send('load-auto-save', null);
    }
  });
});

// Listen for saving data and reset the auto-save file
ipcMain.on('autosave', (event, data) => {
  // Ensure data is an object before saving, or initialize it as an empty object
  const saveData = data || {};

  fs.writeFile(autoSaveFilePath, JSON.stringify(saveData), (err) => {
    if (err) {
      console.error('Error saving auto-save:', err);
    } else {
      console.log('Auto-save updated');
    }
  });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
