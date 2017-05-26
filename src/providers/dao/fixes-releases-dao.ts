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

      db.executeSql("INSERT INTO TB_FIXES_RELEASES VALUES (null, ?, ?, ?)",
      [release.name, release.value, release.type])
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
  public selectFixesOut(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_FIXES_RELEASES WHERE FIXES_TYPE = 0",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações do lançamento de entrada no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectFixesIn(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_FIXES_RELEASES WHERE FIXES_TYPE = 1",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
