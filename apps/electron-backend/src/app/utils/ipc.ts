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
import {Observable} from 'rxjs';
import ipcMain = Electron.ipcMain;

export class IPCMain {
  private static channelObservables: Dictionary<Observable<any>> = {};
  private static channelListeners: Dictionary<Function> = {};

  static getIPC<T>(channel: string): Observable<T> {
    if (this.channelObservables[channel]) {
      return this.channelObservables[channel];
    } else {
      this.channelObservables = Observable.create(observer => {
        this.channelListeners[channel] = (event, ...args) => {
          observer.next(args);
        };
        ipcMain.on(channel, this.channelListeners[channel]);
        return () => {
          ipcMain.removeListener(channel, this.channelListeners[channel]);
          this.channelListeners[channel] = null;
          this.channelObservables[channel] = null;
        };
      });
    }
  }
}
