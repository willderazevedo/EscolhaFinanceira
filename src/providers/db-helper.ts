import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../providers/vars-service';

@Injectable()
export class DbHelper {

  /**
   * Construtor do DbHelper
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela criação de todas as tabelas do app
   * @return {void}
   */
  public createDataBase() {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      //Table User
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_USER (" +
          "USER_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "USER_NAME TEXT NOT NULL," +
          "USER_INCOME DOUBLE NOT NULL" +
        ")", {})
      .then(res => console.log(res))
      .catch(err => console.log(err));

      //Table Various Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_VARIOUS_RELEASES (" +
          "VARIOUS_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "VARIOUS_NAME TEXT NOT NULL," +
          "VARIOUS_VALUE DOUBLE NOT NULL," +
          "VARIOUS_TYPE TEXT NOT NULL," +
          "VARIOUS_PAY_FORM TEXT NOT NULL," +
          "VARIOUS_PLOTS INTEGER DEFAULT 0," +
          "VARIOUS_PLOTS_REMAINING INTEGER DEFAULT 0," +
          "VARIOUS_RELEASES_DATE DATE" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

      //Table Fixes Releases
      db.executeSql("CREATE TABLE IF NOT EXISTS TB_FIXES_RELEASES (" +
          "FIXES_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "FIXES_NAME TEXT NOT NULL," +
          "FIXES_VALUE DOUBLE NOT NULL," +
          "FIXES_TYPE TEXT NOT NULL," +
          "FIXES_RELEASES_DATE DATE" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

      db.executeSql("CREATE TABLE IF NOT EXISTS TB_VARIOUS_CLOSED (" +
          "CLOSED_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "VARIOUS_INDENTIFY INTEGER NOT NULL, " +
          "CLOSED_NAME TEXT NOT NULL," +
          "CLOSED_VALUE DOUBLE NOT NULL," +
          "CLOSED_TYPE TEXT NOT NULL," +
          "CLOSED_PAY_FORM TEXT NOT NULL," +
          "CLOSED_PLOTS INTEGER DEFAULT 0," +
          "CLOSED_DATE DATE" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

      db.executeSql("CREATE TABLE IF NOT EXISTS TB_FIXES_CLOSED (" +
          "CLOSED_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
          "FIXES_INDENTIFY INTEGER NOT NULL, " +
          "CLOSED_NAME TEXT NOT NULL," +
          "CLOSED_VALUE DOUBLE NOT NULL," +
          "CLOSED_TYPE TEXT NOT NULL," +
          "CLOSED_DATE DATE" +
        ");", {})
        .then(res => console.log(res))
        .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }
}
