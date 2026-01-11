const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  protocol,
  Menu,
} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const printService = require("./services/printer.js");
const fs = require("fs");

// Check if we're in development mode (respect NODE_ENV override)
const isDevMode = process.env.NODE_ENV !== "production" && isDev;

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    icon: path.join(__dirname, "../assets/icon.ico"), // App icon
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      // nodeIntegration: true,
    },
    autoHideMenuBar: true, // Hide menu bar (can be shown with Alt key)
  });

  // Remove the menu completely
  Menu.setApplicationMenu(null);

  ipcMain.handle("print-receipt", async (event, ticketData) => {
    try {
      await printService.printTicket(ticketData);
      return { success: true };
    } catch (error) {
      console.error("Print error:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("print-voucher", async (event, voucherData) => {
    try {
      await printService.printVoucher(voucherData);
      return { success: true };
    } catch (error) {
      console.error("Print voucher error:", error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("get-printers", async () => {
    const printers = await mainWindow.webContents.getPrintersAsync(); // Use async version for modern APIs
    // In older versions you can use the sync version:
    // const printers = mainWindow.webContents.getPrinters();
    return printers;
  });

  if (isDevMode) {
    // Development mode - connect to Next.js dev server
    mainWindow.loadURL("http://localhost:3000/");
    // mainWindow.webContents.openDevTools();
  } else {
    // Production mode - load via custom protocol
    mainWindow.loadURL("app://./index.html");
  }
};

// Set up custom protocol scheme for production
if (!isDevMode) {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "app",
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: false,
      },
    },
  ]);
}

app.whenReady().then(() => {
  // Register file protocol handler for production
  if (!isDevMode) {
    protocol.registerFileProtocol("app", (request, callback) => {
      const url = request.url.replace("app://", "");
      try {
        return callback(path.join(__dirname, "../out", url));
      } catch (error) {
        console.error("Protocol error:", error);
        return callback({ error: -2 });
      }
    });
  }

  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
