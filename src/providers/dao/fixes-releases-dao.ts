import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class FixesReleasesDAO {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela gravação das informações do lançamento  no banco SQlite
   * @param  {Object}   release     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public insert(release, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_FIXES_RELEASES VALUES (null, ?, ?, ?, ?)",
      [release.name, release.value, release.type, new Date().toISOString()])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela atualização das informações do laçamento no banco SQlite
   * @param  {Object}   release     Descrição do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public update(release, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("UPDATE TB_FIXES_RELEASES SET " +
          "FIXES_NAME = ?, " +
          "FIXES_VALUE = ?, " +
          "FIXES_TYPE = ? " +
          "WHERE FIXES_ID = ?",
        [release.name, release.value, release.type, release.id])
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
  public close(release, callback) {
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
   * Método responsável pela deleção das informações do laçamento no banco SQlite
   * @param  {int}   release_id  Id do lançamento
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public delete(release_id, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("DELETE FROM TB_FIXES_RELEASES WHERE FIXES_ID = ?", [release_id])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações do lançamento de saida no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectFixesOut(limit, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      if(limit !== "") {
        limit = "ORDER BY RANDOM() LIMIT " + limit;
      }

      db.executeSql("SELECT * FROM TB_FIXES_RELEASES WHERE FIXES_TYPE = 0 " + limit,{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações do lançamento de entrada no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectFixesIn(limit, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      if(limit !== "") {
        limit = "ORDER BY RANDOM() LIMIT " + limit;
      }

      db.executeSql("SELECT * FROM TB_FIXES_RELEASES WHERE FIXES_TYPE = 1 " + limit,{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por buscar o maior gasto fixo
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public getMaxFixesRelease(callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      let year      = new Date().getFullYear().toString();
      let month:any = (new Date().getMonth() + 1);
      month         = month > 9 ? month.toString() : "0" + month.toString();

      db.executeSql("SELECT *,  MAX(FIXES_VALUE) AS MAX_VALUE FROM TB_FIXES_RELEASES " +
      "WHERE FIXES_TYPE = 0 GROUP BY FIXES_TYPE " +
      "HAVING strftime('%m', FIXES_RELEASES_DATE) = ? AND strftime('%Y', FIXES_RELEASES_DATE) = ?",
      [month, year])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por buscar a quantidade de entradas
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public getInCount(callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT COUNT(*) AS VARIOUS_QUANTITY FROM TB_FIXES_RELEASES " +
      "WHERE FIXES_TYPE = 1",
      [])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável por buscar a quantidade de entradas
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public getOutCount(callback) {
    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT COUNT(*) AS VARIOUS_QUANTITY FROM TB_FIXES_RELEASES " +
      "WHERE FIXES_TYPE = 0",
      [])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
