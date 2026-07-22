import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("imovelPraticoAgent", {
  getConfig: () => ipcRenderer.invoke("config:get"),

  activateInstallLink: (payload: {
    entrada: string;
    apiUrlFallback: string;
  }) => ipcRenderer.invoke("install:activate", payload),

  startAgents: () => ipcRenderer.invoke("agents:start"),

  stopAgents: () => ipcRenderer.invoke("agents:stop"),

  getAgentsStatus: () => ipcRenderer.invoke("agents:status"),

  openConfigFolder: () => ipcRenderer.invoke("config:open-folder"),

  onLog: (callback: (message: string) => void) => {
    const listener = (_event: unknown, message: string) => callback(message);

    ipcRenderer.on("agents:log", listener);

    return () => {
      ipcRenderer.off("agents:log", listener);
    };
  },
});
