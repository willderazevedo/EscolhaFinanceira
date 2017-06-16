import { Injectable } from '@angular/core';

//Providers
import { VarsService } from './vars-service';

//Data Access Obeject
import { VariousReleasesDAO } from './dao/various-releases-dao';
import { FixesReleasesDAO } from './dao/fixes-releases-dao';

@Injectable()
export class TotoroBotService {

  constructor(public vars: VarsService, public variousDao: VariousReleasesDAO,
  public fixesDao: FixesReleasesDAO) {}

  /**
   * Checa se o valor colocado no lançamento diverso não ultrapassa metade da renda do usuário,
   * se ultrapassar volta com indicação.
   * @param {Object} release Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseOneVarious(release, callback) {
    let income       = this.vars.income;
    let releaseValue = release.value;
    let saveTip:any  = false;

    if(release.type == 1) {
      callback(saveTip);

      return false;
    }

    if(release.form == 0) {
      releaseValue = release.value/release.plots;
    }

    this.variousDao.selectVariousOut("", data => {
      if(data.rows.length == 0 || (data.rows.length == 1 && release.id !== "")) {
        let spentPercent = (releaseValue * 100)/income;
        let spentValue   = release.value;
        let savePercent  = 0;
        let saveMoney    = 0;
        let savePlots    = 0;

        if (spentPercent < 50) {
          callback(saveTip);

          return false;
        }

        savePercent = (spentPercent - 50) <= 0 ? (spentPercent - 30) : (spentPercent - 40);
        saveMoney   = (savePercent * spentValue)/100;

        if(release.form == 0) {

          for(var i = 2;i <= 30;i++) {
            if((((spentValue/i) * 100)/income) < 50) {
              savePlots = i;

              break;
            }

            savePlots = 30;
          }

          saveTip = "Você está prestes a gastar mais de 50% da sua renda mensal nesta primeira parcela, R$ " + releaseValue.toFixed(2) + " para ser mais exato, " +
          "uma saída para isto seria aumentar o número de parcelas deste lançamento para " + savePlots + "x ou mais.";

          callback(saveTip);

          return false;
        }

        saveTip = "Você está prestes a gastar mais de 50% da sua renda mensal no seu primeiro lançamento, "+ spentPercent.toFixed(2) +"% para ser exato," +
        "uma saída para isto seria pesquisar por algo mais em conta que seja melhor para seu bolso, " +
        "recomendo a você que compre algo em torno de "+ savePercent.toFixed(2) +"% a menos deste valor, você estará enconomizando: R$ " + saveMoney.toFixed(2);
      }

      callback(saveTip);
    });
  }

  /**
   * Checa se o a compra mais as compras feitas menos suas entradas dos lançamentos diversos estarão 90% menos que sua renda,
   * se sim retornará com indicação.
   * @param {Object}   release  Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseTwoVarious(release, callback) {
    let income       = this.vars.income;
    let releaseValue = release.value;
    let saveTip:any  = false;

    if(release.type == 1) {
      callback(saveTip);

      return false;
    }

    if(release.form == 0) {
      releaseValue = release.value/release.plots;
    }

    this.variousDao.selectVariousOut("", data => {
      let rows          = data.rows;
      let sumOutVarious = 0;

      for(var i = 0;i < rows.length;i++) {
        if(rows.item(i).VARIOUS_PAY_FORM == 0) {
          sumOutVarious += (rows.item(i).VARIOUS_VALUE/rows.item(i).VARIOUS_PLOTS);

          continue;
        }

        sumOutVarious += rows.item(i).VARIOUS_VALUE;
      }

      sumOutVarious = sumOutVarious > 0 ? sumOutVarious * (-1) : 0;

      this.fixesDao.selectFixesOutSum(data => {
        let sumOutFixes = data.rows.length > 0 ? (data.rows.item(0).SUM_OUT * (-1)) : 0;

        this.variousDao.selectVariousIn("", data => {
          let rows         = data.rows;
          let sumInVarious = 0;

          for(var i = 0;i < rows.length;i++) {
            sumInVarious += rows.item(i).VARIOUS_VALUE;
          }

          this.fixesDao.selectFixesInSum(data => {
            let sumInFixes   = data.rows.length > 0 ? data.rows.item(0).SUM_IN : 0;
            let spentOnMonth = ((sumOutVarious + sumOutFixes) + (sumInVarious + sumInFixes));
            let spentNow     = spentOnMonth - releaseValue;
            let spentPercent = (spentNow * 100)/income;
            let savePercent  = 0;
            let savePlots    = 0;
            let saveMoney    = 0;

            spentOnMonth = spentOnMonth < 0 ? spentOnMonth * (-1) : spentOnMonth;
            spentNow     = spentNow < 0 ? spentNow * (-1) : spentNow;
            spentPercent = spentPercent < 0 ? spentPercent * (-1) : spentPercent;

            if(spentPercent < 90) {
              callback(saveTip);

              return false;
            }

            if(((spentOnMonth * 100)/income) >= 90) {
              saveTip = "Me parece que você já gastou " + spentPercent.toFixed(2) + "% da sua renda e eu não fui capaz de ver a melhor maneira de economizar nesta compra para que ela seja menor que 90% " +
                        "seria bom que você guardasse o que ainda lhe resta.";

              callback(saveTip);

              return false;
            }

            if(release.form == 0) {
              for(var i = 2; i < 30;i++) {
                let calcBestPlot = (((release.value/i) + spentOnMonth) * 100)/income;

                if(calcBestPlot < 90) {
                  savePlots = i;

                  break;
                }
              }

              for(var i = parseFloat(release.value);i >= 1;i--) {
                let calcBestValue = (((i/release.plots) + spentOnMonth) * 100)/income;

                if(calcBestValue < 90) {
                  saveMoney = i;

                  break;
                }
              }

              saveTip = "Você está prestes a gastar mais de 90% da sua renda mensal na parcela deste lançamento, R$ " + releaseValue.toFixed(2) + " para ser mais exato, " +
                        "uma saída para isto seria aumentar o número de parcelas deste lançamento para " + savePlots + "x ou mais, ou você pode comprar um produto de R$ " +
                        saveMoney.toFixed(2) + " e dividir nesta parcela que deseja.";

              callback(saveTip);

              return false;
            }

            for(var i = 1;i <= 100; i++) {
              let calcBestPercent = ((((releaseValue - (i * releaseValue)/100)) + spentOnMonth) * 100)/income;

              if (calcBestPercent < 90) {
                savePercent = i;

                break;
              }
            }

            saveMoney = releaseValue - ((savePercent * releaseValue)/100);
            saveTip   = "Você irá atingir mais de 90% da sua renda, " + spentPercent.toFixed(2) + "% para ser mais exato, seria melhor que você " +
                        "comprasse um produto no valor " + savePercent.toFixed(2) + "% a menos desse valor, ou seja, um produto de: R$ " + saveMoney.toFixed(2) + ".";

            callback(saveTip);
          });

        });
      });
    });
  }

  /**
   * Checa se o a compra no cartão afetará nos proximos lançamentos do mês, sendo eles outras compras no cartão ou fixos.
   * @param {Object}   release  Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseThreeVarious(release, callback) {
    let income      = this.vars.income;
    let saveTip:any = false;

    if(release.type == 1 || release.form == 1) {
      callback(saveTip);

      return false;
    }

    this.variousDao.selectPlotsValueOnMonth(data => {
      let sumCard = data.rows.length > 0 ? (data.rows.item(0).SUM_CARD * (-1)) : 0;

      this.fixesDao.selectFixesOut("", data => {
        let sumOutFixes = data.rows.length > 0 ? (data.rows.item(0).SUM_OUT * (-1)) : 0;

        this.fixesDao.selectFixesIn("", data => {
          let sumInFixes   = data.rows.length > 0 ? data.rows.item(0).SUM_IN : 0;
          let spentOnMonth = ((sumCard + sumOutFixes) + sumInFixes);
          let spentNow     = (spentOnMonth - (release.value/release.plots));
          let spentPercent = (spentNow * 100)/income;
          let savePercent  = 0;
          let savePlots    = 0;
          let saveMoney    = 0;

          spentOnMonth = spentOnMonth < 0 ? spentOnMonth * (-1) : spentOnMonth;
          spentNow     = spentNow < 0 ? spentNow * (-1) : spentNow;
          spentPercent = spentPercent < 0 ? spentPercent * (-1) : spentPercent;

          if(spentPercent < 75) {
            callback(saveTip);

            return false;
          }

          if(((spentOnMonth * 100)/income) >= 75) {
            saveTip = "Me parece que você já gastou " + spentPercent.toFixed(2) + "% da sua renda e eu não fui capaz de ver a melhor maneira de economizar nesta compra para que ela seja menor que 75% " +
                      "seria bom que você guardasse o que ainda lhe resta pois o próximo mês poderá ser apertado.";

            callback(saveTip);

            return false;
          }

          for(var i = 2;i < 30;i++) {
            let calcBestPlot = (((release.value/i) + spentOnMonth) * 100)/income;

            if(calcBestPlot < 75) {
              savePlots   = i;
              savePercent = calcBestPlot;

              break;
            }
          }

          for(var i = parseFloat(release.value);i >= 1;i--) {
            let calcBestValue = (((i/release.plots) + spentOnMonth) * 100)/income;

            if(calcBestValue < 75) {
              saveMoney = i;

              break;
            }
          }

          saveTip = "Cuidado, você atingiu "+ spentPercent.toFixed(2) +"% da sua renda para o próximo mês juntamente com as parcelas deste mês que ainda não foram pagas, " +
                    "recomendo que divida este lançamento em " + savePlots +"x ou mais, que seria uma economia de "+ savePercent.toFixed(2) + "%, ou você pode comprar um produto " +
                    "igual no valor de R$ " + saveMoney.toFixed(2) + " e deverá atender a esta parcela que deseja.";

          callback(saveTip);
        });
      });
    });
  }

  /**
   * Checa se o valor colocado no lançamento fixo não ultrapassa metade da renda do usuário,
   * se ultrapassar volta com indicação.
   * @param {Object} release Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseOneFixes(release, callback) {
    let income      = this.vars.income;
    let saveTip:any = false;

    if(release.type == 1) {
      callback(saveTip);

      return false;
    }

    this.fixesDao.selectFixesOut("", data => {
      if(data.rows.length == 0 || (data.rows.length == 1 && release.id !== "")) {
        let spentPercent = (release.value * 100)/income;
        let spentValue   = release.value;
        let savePercent  = 0;
        let saveMoney    = 0;

        if (spentPercent < 50) {
          callback(saveTip);

          return false;
        }

        savePercent        = (spentPercent - 50) <= 0 ? (spentPercent - 30) : (spentPercent - 40);
        saveMoney          = (savePercent * spentValue)/100;
        saveTip            = "Você está prestes a gastar mais de 50% da sua renda mensal no seu primeiro lançamento, "+ spentPercent.toFixed(2) +"% para ser exato," +
        "uma saída para isto seria pesquisar por algo mais em conta que seja melhor para seu bolso, " +
        "recomendo a você que compre algo em torno de "+ savePercent.toFixed(2) +"% a menos deste valor, você estará enconomizando: R$ " + saveMoney.toFixed(2)
      }

      callback(saveTip);
    });
  }

  /**
   * Checa se o a compra mais as compras feitas menos suas entradas dos lançamentos fixos estarão 90% menos que sua renda,
   * se sim retornará com indicação.
   * @param {Object}   release  Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseTwoFixes(release, callback) {
    let income      = this.vars.income;
    let saveTip:any = false;

    if(release.type == 1) {
      callback(saveTip);

      return false;
    }

    this.fixesDao.selectFixesOutSum(data => {
      let sumOutFixes = data.rows.length > 0 ? (data.rows.item(0).SUM_OUT * (-1)) : 0;

      this.variousDao.selectVariousOut("", data => {
        let rows          = data.rows;
        let sumOutVarious = 0;

        for(var i = 0;i < rows.length;i++) {
          if(rows.item(i).VARIOUS_PAY_FORM == 0) {
            sumOutVarious += (rows.item(i).VARIOUS_VALUE/rows.item(i).VARIOUS_PLOTS);

            continue;
          }

          sumOutVarious += rows.item(i).VARIOUS_VALUE;
        }

        sumOutVarious = sumOutVarious > 0 ? sumOutVarious * (-1) : 0;

        this.fixesDao.selectFixesInSum(data => {
          let sumInFixes   = data.rows.length > 0 ? data.rows.item(0).SUM_IN : 0;

          this.variousDao.selectVariousIn("", data => {
            let rows         = data.rows;
            let sumInVarious = 0;

            for(var i = 0;i < rows.length;i++) {
              sumInVarious += rows.item(i).VARIOUS_VALUE;
            }

            let spentOnMonth = ((sumOutFixes + sumOutVarious) + (sumInFixes + sumInVarious));
            let spentNow     = spentOnMonth - release.value;
            let spentPercent = (spentNow * 100)/income;
            let savePercent  = 0;
            let saveMoney    = 0;

            spentOnMonth = spentOnMonth < 0 ? spentOnMonth * (-1) : spentOnMonth;
            spentNow     = spentNow < 0 ? spentNow * (-1) : spentNow;
            spentPercent = spentPercent < 0 ? spentPercent * (-1) : spentPercent;

            if(spentPercent < 90) {
              callback(saveTip);

              return false;
            }

            if(((spentOnMonth * 100)/income) >= 90) {
              saveTip = "Me parece que você já gastou " + spentPercent.toFixed(2) + "% da sua renda e eu não fui capaz de ver a melhor maneira de economizar nesta compra para que ela seja menor que 90% " +
                        "seria bom que você guardasse o que ainda lhe resta.";

              callback(saveTip);

              return false;
            }

            for(var i = 1;i <= 100; i++) {
              let calcBestPercent = ((((release.value - (i * release.value)/100)) + spentOnMonth) * 100)/income;

              if (calcBestPercent < 90) {
                savePercent = i;

                break;
              }
            }

            saveMoney = release.value - ((savePercent * release.value)/100);
            saveTip   = "Você irá atingir mais de 90% da sua renda, " + spentPercent.toFixed(2) + "% para ser mais exato, seria melhor que você " +
                        "comprasse um produto no valor " + savePercent.toFixed(2) + "% a menos desse valor, ou seja, um produto de: R$ " + saveMoney.toFixed(2) + ".";

            callback(saveTip);
          });
        });
      });
    });
  }

}
