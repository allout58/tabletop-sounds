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
import {
  AddTrackRequest,
  TRACK_METADATA_REQUEST,
  TRACK_METADATA_RESPONSE,
  TransferWrapper
} from "@tabletop-sounds/ipc-channels";
import * as mm from 'music-metadata';

export class TrackInterface implements Interface {
  constructor(private db: DBAccess) {
  }

  disable() {
    ipcMain.removeAllListeners(TRACK_METADATA_REQUEST);
  }

  enable() {
    this.initMetadata();
  }

  private initMetadata() {
    ipcMain.on(TRACK_METADATA_REQUEST, (event: Event, trackPath: string) => {
      mm.parseFile(trackPath)
        .then(metadata => {
          event.sender.send(TRACK_METADATA_RESPONSE, {
            result: {
              artist: metadata.common.artist,
              album: metadata.common.album,
              name: metadata.common.title,
              location: trackPath
            }
          } as TransferWrapper<AddTrackRequest>)
        })
    })
  }

}
