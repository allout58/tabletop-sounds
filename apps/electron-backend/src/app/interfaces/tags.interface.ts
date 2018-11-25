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

import {Interface} from "./interface";
import {DBAccess} from "../utils/db";
import {Event, ipcMain} from 'electron';
import {SEARCH_TAG_REQUEST, SEARCH_TAG_RESPONSE} from "@tabletop-sounds/ipc-channels";
import {map, tap} from "rxjs/operators";

export class TagsInterface implements Interface {
  constructor(private db: DBAccess) {
  }

  disable() {
    ipcMain.removeAllListeners(SEARCH_TAG_REQUEST);
  }

  enable() {
    this.initSearch();
  }

  private initSearch() {
    ipcMain.on(SEARCH_TAG_REQUEST, (event: Event, arg?: string) => {
      this.db.all<{ tag_name: string }>('SELECT tag_name FROM tags WHERE tag_name LIKE ?', `%${(arg || '').toLowerCase()}%`)
        .pipe(
          map(x => x.map(y => y.tag_name)),
          tap(x => console.log('Tag Search Result', x))
        )
        .subscribe(
          x => event.sender.send(SEARCH_TAG_RESPONSE, {result: x}),
          err => event.sender.send(SEARCH_TAG_RESPONSE, {error: err})
        )
    })
  }


}
