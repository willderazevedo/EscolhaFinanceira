import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { VarsService } from '../vars-service';

@Injectable()
export class ReportDao {

  /**
   * Construtor do Data Access Object de config
   * @param  {SQLite} sqlite    Biblioteca de manipulação SQlite
   * @return {void}
   */
  constructor(public sqlite: SQLite, public vars: VarsService) {}

  /**
   * Método responsável pela busca das informações dos lançamentos que estejam abertos
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectOpenReleases(filters ,callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      let params = [filters.release_type, filters.beginDate, filters.finalDate];
      let sql    = "SELECT * FROM TB_FIXES_RELEASES WHERE " +
                   "FIXES_TYPE = ? AND " +
                   "FIXES_RELEASES_DATE BETWEEN strftime('%Y-%m-%d', ?) AND	strftime('%Y-%m-%d', ?)";

      if(filters.category == 1) {
        params = [filters.release_type];
        sql    = "SELECT * FROM TB_VARIOUS_RELEASES WHERE " +
                 "VARIOUS_TYPE = ? ";

        if(filters.release_type == 0) {
          params.push(filters.pay_form);
          sql += "AND VARIOUS_PAY_FORM = ? ";
        }

        params.push(filters.beginDate, filters.finalDate);
        sql +="AND VARIOUS_RELEASES_DATE BETWEEN strftime('%Y-%m-%d', ?) AND strftime('%Y-%m-%d', ?)";

      }

      db.executeSql(sql, params)
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

  /**
   * Método responsável pela busca das informações dos lançamentos que estejam fechados
   * @param  {Function} callback Função de retorno com os dados
   * @return {void}
   */
  public selectClosedReleases(filters ,callback) {

    this.sqlite.create({
      name: this.vars.DBNAME,
      location: this.vars.DBLOCATION
    }).then((db: SQLiteObject) => {

      let params = [filters.release_type, filters.beginDate, filters.finalDate];
      let sql    = "SELECT * FROM TB_FIXES_CLOSED WHERE " +
                   "CLOSED_TYPE = ? AND " +
                   "CLOSED_DATE BETWEEN strftime('%Y-%m-%d', ?) AND	strftime('%Y-%m-%d', ?)";

      if(filters.category == 1) {
        params = [filters.release_type];
        sql    = "SELECT * FROM TB_VARIOUS_CLOSED WHERE " +
                 "CLOSED_TYPE = ? ";

        if(filters.release_type == 0) {
          params.push(filters.pay_form);
          sql += "AND CLOSED_PAY_FORM = ? ";
        }

        params.push(filters.beginDate, filters.finalDate);
        sql +="AND CLOSED_DATE BETWEEN strftime('%Y-%m-%d', ?) AND strftime('%Y-%m-%d', ?)";

      }

      db.executeSql(sql, params)
      .then(res => callback(res))
      .catch(err => console.log(err));

    }).catch(err => console.log(err));
  }

}
