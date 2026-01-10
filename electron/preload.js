const { contextBridge, ipcRenderer } = require("electron");

(() => {
  contextBridge.exposeInMainWorld("customAPI", {
    getPrinters: () => ipcRenderer.invoke("get-printers"),
    printReceipt: (ticketData) => ipcRenderer.invoke("print-receipt", ticketData),
    printVoucher: (voucherData) => ipcRenderer.invoke("print-voucher", voucherData),
  });
})();
