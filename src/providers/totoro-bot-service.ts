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
   * Checa se o valor colocado não ultrapassa metade da renda do usuário,
   * se ultrapassar volta com indicação.
   * @param {Object} release Dados com a nova release que será cadastrada
   * @param {Function} callback Dados de retorno do bot
   * @return {void|boolean}
   */
  public caseOne(release, callback) {
    let income      = this.vars.income;
    let saveTip:any = false;

    if(release.type == 1) {
      return false;
    }

    if (release.form == 0) {
      release.value = release.value/release.plots;
    }

    this.variousDao.countVariousReleases(data => {
      if(data.rows.length == 0) {
        let spentPercent = (release.value * 100)/income;
        let spentValue   = release.value;
        let savePercent  = 0;
        let saveMoney    = 0;

        if (spentPercent < 50) {
          saveTip = false;
        }

        savePercent        = (spentPercent - 60) <= 0 ? (spentPercent - 30) : (spentPercent - 60);
        saveMoney          = (savePercent * spentValue)/100;
        saveTip            = "Você está prestes a gastar mais de 50% da sua renda mensal no seu primeiro lançamento, "+ spentPercent.toFixed(2) +"% para ser exato," +
        "uma saída para isto seria pesquisar por algo mais em conta que seja melhor para seu bolso, " +
        "recomendo a você que compre algo em torno de "+ savePercent.toFixed(2) +"% a menos deste valor, você estará enconomizando: R$ " + saveMoney.toFixed(2)
      }

      callback(saveTip);
    });
  }

}
