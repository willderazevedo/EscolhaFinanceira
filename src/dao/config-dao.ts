import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ConfigDAO {

  private DBNAME     = "escolhafinanceira.db";
  private DBLOCATION = "default";
  private result;

  constructor(public sqlite: SQLite, public alertCtrl: AlertController) {}

  public insert(user) {

    var result = {};

    this.sqlite.create({
      name: this.DBNAME,
      location: this.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_USER VALUES (NULL, ?, ?, ?, ?, 1)",[
        user.name,
        user.income,
        user.income,
        user.income_day
      ])
      .then(res => result = res)
      .catch(err => console.log(err));

    }).catch(err => console.log(err));

    return result;
  }

}
