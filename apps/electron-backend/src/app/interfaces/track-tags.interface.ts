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
import {
  ADD_TRACK_WITH_TAGS_REQUEST,
  ADD_TRACK_WITH_TAGS_RESPONSE,
  AddTrackRequest,
  TAGS_FOR_TRACK_REQUEST,
  TAGS_FOR_TRACK_RESPONSE,
  TransferWrapper
} from "@tabletop-sounds/ipc-channels";
import {isNumber} from "util";
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {of} from "rxjs";

export class TrackTagsInterface implements Interface {
  constructor(private db: DBAccess) {
  }

  disable() {
    ipcMain.removeAllListeners(TAGS_FOR_TRACK_REQUEST);
  }

  enable() {
    this.initTagsForTrack();
    this.initAddBoth();
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

  private initAddBoth() {
    ipcMain.on(ADD_TRACK_WITH_TAGS_REQUEST, (event: Event, add: { track: AddTrackRequest, tags: string[] }) => {
      const tagQuery = `SELECT id, tag_name
                   FROM tags
                   WHERE tag_name in (${add.tags.map(x => '"' + x + '"').join(',')})`;
      this.db.all(tagQuery)
        .pipe(
          switchMap((previousTags: { id: number, tag_name: string }[]) => {
            const oldTags = previousTags.map(x => x.tag_name);
            const toAdd = add.tags.filter(x => !oldTags.includes(x));
            return toAdd.length > 0 ? this.db.run(`INSERT INTO tags (tag_name)
            VALUES ${toAdd.map(x => '("' + x + '")').join(',')}`) : of(true);
          }),
          withLatestFrom(
            this.db.all<{ id: string, tag_name: string }>(tagQuery),
            this.db.run('INSERT INTO tracks (name, album, artist, location) VALUES (?, ?, ?, ?)', add.track.name, add.track.album, add.track.artist, add.track.location),
            this.db.get<{ id: string }>('SELECT id FROM tracks where location=?', add.track.location)
          ),
          switchMap(([ins1, tags, ins2, track]) => {
              const pairs = tags.map(x => ([track.id, x.id])).reduce((acc, val) => acc.concat(val), [])
              let sql = new Array(tags.length).fill('(?,?)');
              return this.db.run(
                'INSERT INTO track_tags VALUES ' + sql.join(', '),
                ...pairs
              )
            }
          )
        )
        .subscribe(
          () => event.sender.send(ADD_TRACK_WITH_TAGS_RESPONSE, {result: true} as TransferWrapper<boolean>),
          err => event.sender.send(ADD_TRACK_WITH_TAGS_RESPONSE, {error: err} as TransferWrapper<boolean>)
        )
    });
  }
}
