import { ipcMain, app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getImages } from './backend/getImages.js';
import { uploadImage } from './backend/uploadImage.js';
import { deleteImage } from './backend/deleteImage.js';
import fs from 'fs';

// Suporte para __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho do arquivo de configuração
const configPath = path.join(app.getPath('userData'), 'config.json');

// Se não existir, cria com valores padrão
// Arquivo de configuração padrão (adicionando x e y)
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(
    configPath,
    JSON.stringify({
      isMaximized: false,
      width: 1000,
      height: 600,
      x: undefined,
      y: undefined,
    }, null, 2)
  );
}

const configFile = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

function createWindow() {
  const win = new BrowserWindow({
    width: configFile.isMaximized ? undefined : configFile.width,
    height: configFile.isMaximized ? undefined : configFile.height,
    x: configFile.isMaximized ? null : configFile.x,
    y: configFile.isMaximized ? null : configFile.y,
    minWidth: 400,
    minHeight: 400,
    title: 'Compresso',
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
    },
  });

  if (configFile.isMaximized) {
    win.maximize();
  }

  win.setMenu(null);

  win.loadFile(path.join(__dirname, 'frontend/dist/index.html'));

  win.on('close', () => {
    const bounds = win.getBounds();
    const state = {
      isMaximized: win.isMaximized(),
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
    };

    fs.writeFileSync(configPath, JSON.stringify(state, null, 2));

  });

  // win.webContents.openDevTools();
}


app.whenReady().then(createWindow);

// Handlers de comunicação IPC
ipcMain.handle('get-images', async () => getImages());
ipcMain.handle('upload-image', async (event, args) => uploadImage(args));
ipcMain.handle('delete-image', async (event, filename) => deleteImage(filename));