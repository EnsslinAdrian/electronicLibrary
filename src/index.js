const { app, BrowserWindow } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.resolvePathFn = () => path.join('C:/Users/enssl/Documents/Programmieren/Electron/release', 'logs/main.log');
log.log("Application version = " + app.getVersion());

let mainWindow;

// 🪟 **Hauptfenster erstellen**
const createWindow = () => {
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
      },
  });

  // Lade die Angular-Index-Datei
  mainWindow.loadFile(path.join(__dirname, 'content', 'index.html'));
  mainWindow.webContents.openDevTools();
};

// 🚀 **Event-Handling für AutoUpdater**
function setupAutoUpdater() {
  autoUpdater.on("checking-for-update", () => {
      log.info("🔍 Checking for updates...");
  });

  autoUpdater.on("update-available", () => {
      log.info("✅ Update available.");
  });

  autoUpdater.on("update-not-available", () => {
      log.info("ℹ️ No updates available.");
  });

  autoUpdater.on("error", (err) => {
      log.error("❌ Error in auto-updater:", err);
  });

  autoUpdater.on("download-progress", (progressTrack) => {
      log.info("📥 Download progress:", progressTrack);
  });

  autoUpdater.on("update-downloaded", () => {
      log.info("🎯 Update downloaded. Installing...");
      autoUpdater.quitAndInstall();
  });
}

// 🚦 **App ist bereit**
app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
  autoUpdater.checkForUpdatesAndNotify();

  // MacOS-Support: Fenster neu erstellen, falls keins mehr offen ist
  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
      }
  });
});

// ❌ **App schließen, wenn alle Fenster zu sind (außer auf macOS)**
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});
