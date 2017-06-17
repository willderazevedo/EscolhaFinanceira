import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class ClosedFixesReleasesDao {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela busca das informações do lançamento fixos fechados no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectFixesCloseds(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_FIXES_CLOSED",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela pelo fechamento do mês deste lançamento
   * @param  {Object}   release     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public closeFixesReleases(release, callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_FIXES_CLOSED VALUES (null, ?, ?, ?, ?, ?)",
      [release.FIXES_ID, release.FIXES_NAME, release.FIXES_VALUE, release.FIXES_TYPE, new Date().toISOString()])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela pelo fechamento do mês deste lançamento
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

      db.executeSql("SELECT * FROM TB_FIXES_CLOSED " +
      "WHERE FIXES_INDENTIFY = ? GROUP BY CLOSED_NAME " +
      "HAVING strftime('%m', CLOSED_DATE) = ? AND strftime('%Y', CLOSED_DATE) = ?",
      [release_id, month, year])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }
}
