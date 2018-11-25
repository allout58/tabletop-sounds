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

import {Event, ipcMain} from 'electron';
import {Interface} from "./interface";
import {DBAccess} from "../utils/db";
import {AddTrackRequest, TAGS_FOR_TRACK_REQUEST, TAGS_FOR_TRACK_RESPONSE} from "@tabletop-sounds/ipc-channels";
import {isNumber} from "util";
import {map} from "rxjs/operators";

export class TrackTagsInterface implements Interface {
  constructor(private db: DBAccess) {
  }

  disable() {
    ipcMain.removeAllListeners(TAGS_FOR_TRACK_REQUEST);
  }

  enable() {
    this.initTagsForTrack();
  }

  private initTagsForTrack() {
    ipcMain.on(TAGS_FOR_TRACK_REQUEST, (event: Event, track: number | AddTrackRequest) => {
      if (isNumber(track)) {
        this.db.all<{ tag_name: string }>('SELECT tag_name FROM tags INNER JOIN track_tags tt on tags.id = tt.tag_id WHERE track_id = ?', track)
          .pipe(
            map(x => x.map(y => y.tag_name))
          )
          .subscribe(x => {
            event.sender.send(TAGS_FOR_TRACK_RESPONSE, x);
          })
      } else {
        this.db.all<{ tag_name: string }>('SELECT * FROM tags INNER JOIN track_tags tt on tags.id = tt.tag_id INNER JOIN tracks t on tt.track_id = t.id WHERE t.artist=? AND t.album=? and t.name=?', track.artist, track.album, track.name)
          .pipe(
            map(x => x.map(y => y.tag_name))
          )
          .subscribe(x => {
            event.sender.send(TAGS_FOR_TRACK_RESPONSE, x);
          })
      }
    })
  }
}
