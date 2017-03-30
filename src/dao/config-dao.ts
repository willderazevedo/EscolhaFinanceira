import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ConfigDAO {

  constructor(public sqlite: SQLite) {}

}
