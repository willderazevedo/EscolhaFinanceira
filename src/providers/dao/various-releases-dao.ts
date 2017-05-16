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

      db.executeSql("INSERT INTO TB_VARIOUS_RELEASES VALUES (null, ?, ?, ?, ?, ?)",[
        release.name,
        release.value,
        release.type,
        release.form,
        release.plots
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
          "VARIOUS_PLOTS = ? " +
          "WHERE VARIOUS_ID = ?",
        [release.name, release.value, release.type, release.form, release.plots, release.id])
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
   * Método responsável pela busca das informações do lançamento  no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public select(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_VARIOUS_RELEASES",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
