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

export const SEARCH_TRACK_REQUEST = 'track.search.request';
export const SEARCH_TRACK_RESPONSE = 'track.search.response';

export const ADD_TRACK_REQUEST = 'track.add.request';
export const ADD_TRACK_RESPONSE = 'track.add.response';

// TODO: Rename this?
export interface AddTrackRequest {
  name: string,
  album: string,
  artist: string,
  location: string
}

export const TRACK_METADATA_REQUEST = 'track.metadata.request';
export const TRACK_METADATA_RESPONSE = 'track.metadata.response';
