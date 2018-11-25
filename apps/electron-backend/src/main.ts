import {app} from 'electron';
import * as path from 'path';
import * as url from 'url';
import {environment} from './environments/environment';
import {DBAccess} from './app/utils/db';
import {Interface, TagsInterface, TrackInterface, TrackTagsInterface} from './app/interfaces';
import {WindowManager} from "./app/utils/window";
import {Dictionary} from "@tabletop-sounds/utils";

const db = new DBAccess();
db.close().subscribe();

const interfaces: Dictionary<Interface> = {};

function createMainWindow() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (WindowManager.getInstance().getWindow('main') == null) {
    let win = WindowManager.getInstance().createWindow('main', null);

    if (!environment.production) {
      require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../../../node_modules/.bin/electron')
      });
      win.loadURL('http://localhost:4200');
    } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }
  }
}

function initializeInterfaces() {
  interfaces['track'] = new TrackInterface(db);
  interfaces['tags'] = new TagsInterface(db);
  interfaces['track-tags'] = new TrackTagsInterface(db);

  Object.values(interfaces).forEach(intf => intf.enable());
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createMainWindow();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    createMainWindow();
  });

  initializeInterfaces();

} catch (e) {
  // Catch Error
  // throw e;
}
