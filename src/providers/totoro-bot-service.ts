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
      let rows   = data.rows;
      let sumOut = 0;

      for(var i = 0;i < rows.length;i++) {
        if(rows.item(i).VARIOUS_PAY_FORM == 0) {
          sumOut += (rows.item(i).VARIOUS_VALUE/rows.item(i).VARIOUS_PLOTS);

          continue;
        }

        sumOut += rows.item(i).VARIOUS_VALUE;
      }

      sumOut = sumOut > 0 ? sumOut * (-1) : 0;

      this.variousDao.selectVariousIn("", data => {
        let rows  = data.rows;
        let sumIn = 0;

        for(var i = 0;i < rows.length;i++) {
          sumIn += rows.item(i).VARIOUS_VALUE;
        }

        let spentOnMonth = (sumOut + sumIn);
        let spentNow     = spentOnMonth - releaseValue;
        let spentPercent = (spentNow * 100)/income;
        let savePercent  = 0;
        let savePlots    = 0;
        let saveMoney    = 0;

        spentOnMonth = spentOnMonth < 0 ? spentOnMonth * (-1) : spentOnMonth;
        spentNow     = spentNow < 0 ? spentNow * (-1) : spentNow;
        spentPercent = spentPercent < 0 ? spentPercent * (-1) : spentPercent;

        if(spentPercent < 80) {
          callback(saveTip);

          return false;
        }

        if(release.form == 0) {
          for(var i = 2; i < 30;i++) {
            let calcBestPlot = (((release.value/i) + spentOnMonth) * 100)/income;

            if(calcBestPlot < 80) {
              savePlots   = i;
              savePercent = calcBestPlot;

              break;
            }
          }

          for(var i = parseFloat(release.value);i >= 1;i--) {
            let calcBestValue = (((i/release.plots) + spentOnMonth) * 100)/income;

            if(calcBestValue < 80) {
              saveMoney = i;

              break;
            }
          }

          saveTip = "Você está prestes a gastar mais de 80% da sua renda mensal na parcela deste lançamento, R$ " + releaseValue.toFixed(2) + " para ser mais exato, " +
                    "uma saída para isto seria aumentar o número de parcelas deste lançamento para " + savePlots + "x ou mais, ou você pode comprar um produto de R$ " +
                    saveMoney.toFixed(2) + " e dividir nesta parcela que deseja.";

          callback(saveTip);

          return false;
        }

        for(var i = 1;i <= 100; i++) {
          let calcBestPercent = ((((releaseValue - (i * releaseValue)/100)) + spentOnMonth) * 100)/income;

          if (calcBestPercent < 80) {
            savePercent = i;

            break;
          }
        }

        saveMoney = releaseValue - ((savePercent * releaseValue)/100);
        saveTip   = "Você irá atingir mais de 80% da sua renda, " + spentPercent.toFixed(2) + "% para ser mais exato, seria melhor que você " +
                    "comprasse um produto no valor " + savePercent.toFixed(2) + "% a menos desse valor, ou seja, um produto de: R$ " + saveMoney.toFixed(2) + ".";

        callback(saveTip);
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
   * Checa se a atual compra mais as compras feitas menos suas entradas estarão 80% menos que sua renda, se sim retornará com indicação.
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
      let sumOut = data.rows.length > 0 ? (data.rows.item(0).SUM_OUT * (-1)) : 0;

      this.fixesDao.selectFixesInSum(data => {
        let sumIn        = data.rows.length > 0 ? data.rows.item(0).SUM_IN : 0;
        let spentOnMonth = (sumOut + sumIn);
        let spentNow     = spentOnMonth - release.value;
        let spentPercent = (spentNow * 100)/income;
        let savePercent  = 0;
        let saveMoney    = 0;

        spentOnMonth = spentOnMonth < 0 ? spentOnMonth * (-1) : spentOnMonth;
        spentNow     = spentNow < 0 ? spentNow * (-1) : spentNow;
        spentPercent = spentPercent < 0 ? spentPercent * (-1) : spentPercent;

        if(spentPercent < 80) {
          callback(saveTip);

          return false;
        }

        for(var i = 1;i <= 100; i++) {
          let calcBestPercent = ((((release.value - (i * release.value)/100)) + spentOnMonth) * 100)/income;

          if (calcBestPercent < 80) {
            savePercent = i;

            break;
          }
        }

        saveMoney = release.value - ((savePercent * release.value)/100);
        saveTip   = "Você irá atingir mais de 80% da sua renda, " + spentPercent.toFixed(2) + "% para ser mais exato, seria melhor que você " +
                    "comprasse um produto no valor " + savePercent.toFixed(2) + "% a menos desse valor, ou seja, um produto de: R$ " + saveMoney.toFixed(2) + ".";

        callback(saveTip);
      });
    });
  }

}
