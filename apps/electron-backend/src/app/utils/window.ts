/*
 *  Copyright 2018 James Hollowell
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import {Dictionary} from '@tabletop-sounds/utils';
import {BrowserWindow, BrowserWindowConstructorOptions, screen} from 'electron';
import {environment} from "../../environments/environment";

export class WindowManager {
  private static instance: WindowManager;

  static getInstance(): WindowManager {
    if (WindowManager.instance == null) {
      WindowManager.instance = new WindowManager();
    }
    return WindowManager.instance;
  }

  private readonly windowDictionary: Dictionary<BrowserWindow> = {};

  public createWindow(name: string, url?: string, x = 0, y = 0, width = -1, height = -1, options: Partial<BrowserWindowConstructorOptions> = {}): BrowserWindow {
    if (name in this.windowDictionary) {
      throw Error(`'${name}' is already created`);
    }
    const screenSize = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
      x: x,
      y: y,
      width: (width < 0 ? screenSize.width : width),
      height: (height < 0 ? screenSize.height : height),
      ...options
    });
    this.windowDictionary[name] = win;
    if (url != null) {
      win.loadURL(url);
    }

    if (!environment.production) {
      // My personal preference
      win.webContents.openDevTools({mode: "bottom"});
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store window
      delete this.windowDictionary[name];
    });

    return win;
  }

  public getWindow(name: string): BrowserWindow {
    return this.windowDictionary[name];
  }
}
