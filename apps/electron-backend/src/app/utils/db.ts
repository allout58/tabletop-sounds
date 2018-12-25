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

import {Database, OPEN_CREATE, OPEN_READWRITE} from 'sqlite3';
import {Observable} from 'rxjs';

export class DBAccess {
  private isEmptyDB = true;

  private _db: Database;

  private get db(): Database {
    if (this._db == null) {
      this._db = new Database('./data/data.sqlite3', OPEN_CREATE | OPEN_READWRITE);
    }
    if (this.isEmptyDB) {
      this.createDB();
    }
    return this._db;
  }

  close(): Observable<null> {
    return Observable.create(observer => {
      this.db.close(err => {
          if (err) {
            observer.error(err);
          } else {
            observer.next(null);
            this._db = null;
          }
          observer.complete();
        }
      );
    });
  }

  /**
   * Attempts to create the DB Schema
   */
  // TODO: Determine how to upgrade a schema when needed
  private createDB() {
    // language=SQLite
    this._db.run('CREATE TABLE IF NOT EXISTS tracks (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'name VARCHAR NOT NULL,' +
      'album VARCHAR NOT NULL,' +
      'artist VARCHAR NOT NULL,' +
      'location VARCHAR NOT NULL,' +
      'CONSTRAINT track_unique UNIQUE (name, album, artist)' +
      ');');
    this._db.run('create unique index IF NOT EXISTS tracks_location_uindex on tracks (location);');
    // language=SQLite
    this._db.run('CREATE TABLE IF NOT EXISTS tags (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'tag_name VARCHAR NOT NULL,' +
      'CONSTRAINT tag_name_unique UNIQUE (tag_name)' +
      ');');
    // language=SQLite
    this._db.run('CREATE TABLE IF NOT EXISTS track_tags (' +
      'track_id INTEGER,' +
      'tag_id INTEGER,' +
      'PRIMARY KEY (track_id, tag_id),' +
      'FOREIGN KEY (track_id) REFERENCES tracks (id) ON DELETE CASCADE ON UPDATE NO ACTION,' +
      'FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE ON DELETE NO ACTION' +
      ');');

    this.isEmptyDB = false;
  }

  /**
   * Return all rows that match the given SQL query as an array
   * @param sql
   * @param params
   * @return Observable of an array containing all the results
   */
  all<T>(sql: string, ...params): Observable<T[]> {
    return Observable.create(observer => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Error with SQL', err);
          observer.error(err);
        } else {
          observer.next(rows);
        }
        observer.complete();
      });
    });
  }

  /**
   * Return the first row that matches the given SQL query
   * @param sql
   * @param params
   * @return Observable of an array containing all the results
   */
  get<T>(sql: string, ...params): Observable<T> {
    return Observable.create(observer => {
      this.db.get(sql, params, (err, row) => {
        console.log('resp', err, row);
        if (err) {
          console.error('Error with SQL', err);
          observer.error(err);
        } else {
          observer.next(row);
        }
        observer.complete();
      });
    });
  }

  run(sql: string, ...params): Observable<boolean> {
    return Observable.create(observer => {
      this.db.run(sql, params, err => {
        if (err) {
          console.error('Error with SQL', err);
          observer.error(err);
        } else {
          observer.next(true);
        }
        observer.complete();
      })
    })
  }


  //
  // get(sql: string, ...params): this {
  //   return super.get(sql, params);
  // }
  //
  // each(sql: string, ...params): this {
  //   return super.each(sql, params);
  // }
  //
  // exec(sql: string, callback?: (this: Statement, err: (Error | null)) => void): this {
  //   return super.exec(sql, callback);
  // }
  //
  // prepare(sql: string, ...params): Statement {
  //   return super.prepare(sql, params);
  // }
  //
  // serialize(callback?: () => void): void {
  //   super.serialize(callback);
  // }
  //
  // parallelize(callback?: () => void): void {
  //   super.parallelize(callback);
  // }
  //
  // on(event: string, listener: (...args: any[]) => void): this {
  //   return super.on(event, listener);
  // }
  //
  // configure(option: "busyTimeout", value: number): void {
  //   super.configure(option, value);
  // }
}
