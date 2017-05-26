import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class ClosedVariousReleasesDao {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela busca das informações do lançamento diversos fechados no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectVariousCloseds(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_VARIOUS_CLOSED",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  public closeVariousRelease(release, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_VARIOUS_CLOSED VALUES(null, ?, ?, ?, ?, ?, ?, ?)"
      , [
          release.VARIOUS_ID,
          release.VARIOUS_NAME,
          release.VARIOUS_VALUE,
          release.VARIOUS_TYPE,
          release.VARIOUS_PAY_FORM,
          release.VARIOUS_PLOTS,
          new Date().toISOString()
      ])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela pelo fechamento do mês deste lançamento quando for cartão
   * @param  {Object}   release     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public haveClosedInThisMonth(release_id, callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      let year      = new Date().getFullYear().toString();
      let month:any = (new Date().getMonth() + 1);
      month         = month > 9 ? month.toString() : "0" + month.toString();

      db.executeSql("SELECT * FROM TB_VARIOUS_CLOSED " +
      "WHERE VARIOUS_INDENTIFY = ? GROUP BY CLOSED_NAME " +
      "HAVING strftime('%m', CLOSED_DATE) = ? AND strftime('%Y', CLOSED_DATE) = ?",
      [release_id, month, year])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
