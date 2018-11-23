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

import {DBAccess} from '../utils/db';
import {SEARCH_TRACK_REQUEST, SEARCH_TRACK_RESPONSE} from '@tabletop-sounds/ipc-channels';
import {ipcMain} from 'electron';

export class TrackInterface {
  constructor(private db: DBAccess) {
    this.initSearch();
  }

  private initSearch() {
    ipcMain.on(SEARCH_TRACK_REQUEST, (event, ...args) => {
      console.log('Event', event, 'args', args);
      // language=SQLite
      this.db.all('SELECT * from tracks WHERE ').subscribe(x => {
        event.sender.send(SEARCH_TRACK_RESPONSE, {result: x});
      }, error1 => {
        // language=
        event.sender.send(SEARCH_TRACK_RESPONSE, {error: error1});
      });
    });
  }
}
