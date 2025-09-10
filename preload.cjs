const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getImages: () => ipcRenderer.invoke('get-images'),
  uploadImage: (args) => ipcRenderer.invoke('upload-image', args),
  deleteImage: (filename) => ipcRenderer.invoke('delete-image', filename),
});
