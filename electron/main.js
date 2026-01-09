const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const printService = require("../services/printer.js");

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  ipcMain.handle("print-receipt", async () => {
    printService.printTicket();
  });

  ipcMain.handle("get-printers", async () => {
    const printers = await mainWindow.webContents.getPrintersAsync(); // Use async version for modern APIs
    // In older versions you can use the sync version:
    // const printers = mainWindow.webContents.getPrinters();
    return printers;
  });

  if (isDev) {
    // 開發階段直接與 React 連線
    mainWindow.loadURL("http://localhost:3000/");
    // 開啟 DevTools.
    // mainWindow.webContents.openDevTools();
  } else {
    // 產品階段直接讀取 React 打包好的
    mainWindow.loadFile("./build/index.html");
  }
};

(async () => {
  app.whenReady().then(async () => {
    createWindow();
    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });
})();
