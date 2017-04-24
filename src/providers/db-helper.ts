import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DbHelper {

  private DBNAME     = "escolhafinanceira.db";
  private DBLOCATION = "default";

  constructor(public sqlite: SQLite) {}

  public createDataBase() {
    this.sqlite.create({
      name: this.DBNAME,
      location: this.DBLOCATION
    }).then((db: SQLiteObject) => {

      //Table User
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_USER (" +
          "USER_ID INT PRIMARY KEY," +
          "USER_NAME VARCHAR(60) NOT NULL," +
          "USER_INCOME DOUBLE NOT NULL," +
          "USER_WALLET DOUBLE NOT NULL," +
          "USER_INCOME_DAY VARCHAR(2) NOT NULL," +
          "USER_TUTORIAL BOOLEAN DEFAULT 1" +
        ")", {})
      .then(res => console.log(res))
      .catch(err => console.log(err));

      //Table Various Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_VARIOUS_RELEASES (" +
          "VARIOUS_ID INT PRIMARY KEY," +
          "VARIOUS_NAME VARCHAR(60) NOT NULL," +
          "VARIOUS_VALUE DOUBLE NOT NULL," +
          "VARIOUS_TYPE VARCHAR(7) NOT NULL," +
          "VARIOUS_PAY_FORM VARCHAR(6) NOT NULL," +
          "VARIOUS_PLOTS INT DEFAULT 0" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

      //Table Fixes Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_FIXES_RELEASES (" +
          "FIXES_ID INT PRIMARY KEY," +
          "FIXES_NAME VARCHAR(60) NOT NULL," +
          "FIXES_VALUE DOUBLE NOT NULL," +
          "FIXES_TYPE VARCHAR(7) NOT NULL" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }
}
