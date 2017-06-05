import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class ConfigDAO {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela gravação das informações do usuário  no banco SQlite
   * @param  {Object}   user     Descrição do usuario
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public insert(user, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("INSERT INTO TB_USER VALUES (null, ?, ?, 1)",[
        user.name,
        user.income,
      ])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela atualização das informações do usuário  no banco SQlite
   * @param  {Object}   user     Descrição do usuario
   * @param  {Function} callback Função de retorno para saber se deu certo ou não
   * @return {void}
   */
  public update(user, callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("UPDATE TB_USER SET USER_NAME = ?, USER_INCOME = ?",[
        user.name,
        user.income
      ])
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }
  
  /**
   * Método responsável pela busca das informações do usuário  no banco SQlite
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public select(callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      db.executeSql("SELECT * FROM TB_USER",{})
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
