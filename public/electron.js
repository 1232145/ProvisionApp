const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // win.webContents.openDevTools();

  win.loadFile(
    `${path.join(__dirname, '../build/index.html')}`
  );

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