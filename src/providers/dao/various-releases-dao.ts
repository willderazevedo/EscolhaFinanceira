import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class VariousReleasesDAO {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela gravação das informações do lançamento  no banco SQlite
   * @param  {Object}   user     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public insert(release, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_VARIOUS_RELEASES VALUES (null, ?, ?, ?, ?, ?, ?, ?)",[
        release.name,
        release.value,
        release.type,
        release.form,
        release.plots,
        release.plots,
        new Date().toISOString()
      ])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela atualização das informações do laçamento no banco SQlite
   * @param  {Object}   user     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public update(release, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("UPDATE TB_VARIOUS_RELEASES SET " +
          "VARIOUS_NAME = ?, " +
          "VARIOUS_VALUE = ?, " +
          "VARIOUS_TYPE = ?, " +
          "VARIOUS_PAY_FORM = ?, " +
          "VARIOUS_PLOTS = ?, " +
          "VARIOUS_PLOTS_REMAINING = ?" +
          "WHERE VARIOUS_ID = ?",
        [release.name, release.value, release.type, release.form, release.plots, release.plots, release.id])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela deleção das informações do laçamento no banco SQlite
   * @param  {Object}   user     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public delete(release_id, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("DELETE FROM TB_VARIOUS_RELEASES WHERE VARIOUS_ID = ?", [release_id])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações do lançamento de saida  no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectVariousOut(limit, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      if(limit !== "") {
        limit = "ORDER BY RANDOM() LIMIT " + limit;
      }

      db.executeSql("SELECT * FROM TB_VARIOUS_RELEASES WHERE VARIOUS_TYPE = 0 " + limit,{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações do lançamento de entrada  no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectVariousIn(limit, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      if(limit !== "") {
        limit = "ORDER BY RANDOM() LIMIT " + limit;
      }

      db.executeSql("SELECT * FROM TB_VARIOUS_RELEASES WHERE VARIOUS_TYPE = 1 " + limit,{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por diminuir uma parcela do lançamento pago com cartão
   * @param  {int} release_id Id do lançamento
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public decreasePlots(release_id, callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("UPDATE TB_VARIOUS_RELEASES SET VARIOUS_PLOTS_REMAINING = VARIOUS_PLOTS_REMAINING - 1 " +
      "WHERE VARIOUS_ID = ?"
      ,[release_id])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por buscar as parcelas restantes do lançamento pago no cartão
   * @param  {int} release_id Id do lançamento
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public getRemainingPlots(release_id, callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT VARIOUS_PLOTS_REMAINING AS REMAIN FROM TB_VARIOUS_RELEASES " +
      "WHERE VARIOUS_ID = ?"
      ,[release_id])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por buscar o maior gasto diverso
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public getMaxVariousRelease(callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      let year      = new Date().getFullYear().toString();
      let month:any = (new Date().getMonth() + 1);
      month         = month > 9 ? month.toString() : "0" + month.toString();

      db.executeSql("SELECT *,  MAX(VARIOUS_VALUE) AS MAX_VALUE FROM TB_VARIOUS_RELEASES " +
      "WHERE VARIOUS_TYPE = 0 GROUP BY VARIOUS_TYPE " +
      "HAVING strftime('%m', VARIOUS_RELEASES_DATE) = ? AND strftime('%Y', VARIOUS_RELEASES_DATE) = ?",
      [month, year])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
