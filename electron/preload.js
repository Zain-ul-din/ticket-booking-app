const { contextBridge, ipcRenderer } = require("electron");

(() => {
  contextBridge.exposeInMainWorld("customAPI", {
    getPrinters: () => ipcRenderer.invoke("get-printers"),
    printReceipt: () => ipcRenderer.invoke("print-receipt"),
  });
})();
