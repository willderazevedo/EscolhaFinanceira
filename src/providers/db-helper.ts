import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class DbHelper {

  constructor(public sqlite: SQLite, public platform: Platform) {}

  public createDataBase() {
    this.sqlite.create({
      name: "escolhafinanceita.db",
      location: "default"
    }).then((db: SQLiteObject) => {

      //Table User
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_USER (" +
          "USER_ID INT PRIMARY KEY AUTO_INCREMENT," +
          "USER_NAME VARCHAR(60) NOT NULL," +
          "USER_INCOME DOUBLE NOT NULL," +
          "USER_WALLET DOUBLE NOT NULL," +
          "USER_INCOME_DAY VARCHAR(2) NOT NULL," +
          "USER_TUTORIAL BOOLEAN DEFAULT 1" +
        ");", {})
        .then(() => console.log("Table user created"))
        .catch(err => console.log(err));

      //Table Various Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_VARIOUS_RELEASES (" +
          "VARIOUS_ID INT PRIMARY KEY AUTO_INCREMENT," +
          "VARIOUS_NAME VARCHAR(60) NOT NULL," +
          "VARIOUS_VALUE DOUBLE NOT NULL," +
          "VARIOUS_TYPE VARCHAR(7) NOT NULL," +
          "VARIOUS_PAY_FORM VARCHAR(6) NOT NULL," +
          "VARIOUS_PLOTS INT DEFAULT 0" +
        ");", {})
        .then(() => console.log("Table user created"))
        .catch(err => console.log(err));

      //Table Fixes Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_FIXES_RELEASES (" +
          "FIXES_ID INT PRIMARY KEY AUTO_INCREMENT," +
          "FIXES_NAME VARCHAR(60) NOT NULL," +
          "FIXES_VALUE DOUBLE NOT NULL," +
          "FIXES_TYPE VARCHAR(7) NOT NULL" +
        ");", {})
        .then(() => console.log("Table fixes releases created"))
        .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }
}
