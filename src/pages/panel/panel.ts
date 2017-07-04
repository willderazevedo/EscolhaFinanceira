import { Component } from '@angular/core';
import { MenuController, LoadingController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';
import { VarsService } from '../../providers/vars-service';

//Pages
import { VariousReleasesPage } from '../various-releases/various-releases';
import { FixesReleasesPage } from '../fixes-releases/fixes-releases';

@Component({
  selector: 'page-panel',
  templateUrl: 'panel.html'
})
export class PanelPage {

  /**
   * Pagina de lançamentos diversos
   * @type {Object}
   */
  various_page           = VariousReleasesPage;

  /**
   * Página de lançamentos fixos
   * @type {Object}
   */
  fixes_page             = FixesReleasesPage;

  /**
   * Maior lançamento diverso
   * @type {Array}
   */
  higher_various_release = [];

  /**
   * Maior lançamento fixo
   * @type {Array}
   */
  higher_fixes_release   = [];

  /**
   * Lançamentos diversos
   * @type {Array}
   */
  various_releases       = [];

  /**
   * Lançamentos fixos
   * @type {Array}
   */
  fixes_releases         = [];

  /**
   * Contrutor da classe PanelPage
   * @param {MenuController}     menu       Biblioteca nativa para controle do menu
   * @param {GlobalService}      global     Provider responsável pelas funções globais
   * @param {FixesReleasesDAO}   fixesDao   Data Access Object de lançamentos fixos
   * @param {VariousReleasesDAO} variousDao Data Access Object de lançamentos diversos
   * @param {LoadingController}  loadCtrl   Biblioteca nativa responsável por controlar alertas de carregamento
   * @param {VarsService}              vars             Provider para acesso de variaveis globais
   * @return {void}
   */
  constructor(public menu: MenuController, public global: GlobalService,
  public fixesDao: FixesReleasesDAO, public variousDao: VariousReleasesDAO,
  public loadCtrl: LoadingController, public vars: VarsService) {
    this.menu.swipeEnable(true);
    this.loadInformations();
  }

  /**
   * Método responsável por carregar todo painel inicial
   * @returns {void}
   */
  private loadInformations() {
    let load = this.loadCtrl.create({content:"Carregando painel..."});

    load.present();
    this.variousDao.getMaxVariousRelease(data => {
      let length = data.rows.length;

      for(let i = 0;i < length;i++) {
        this.higher_various_release.push(data.rows.item(i));
      }

      this.fixesDao.getMaxFixesRelease(data => {
        let length = data.rows.length;

        for(let i = 0;i < length;i++) {
          this.higher_fixes_release.push(data.rows.item(i));
        }

        this.variousDao.selectVariousOut("3", data => {
          let length = data.rows.length;

          for(let i = 0;i < length;i++) {
            this.various_releases.push(data.rows.item(i));
          }

          this.variousDao.selectVariousIn("3", data => {
            let length = data.rows.length;

            for(let i = 0;i < length;i++) {
              this.various_releases.push(data.rows.item(i));
            }

            this.fixesDao.selectFixesOut("3", data => {
              let length = data.rows.length;

              for(let i = 0;i < length;i++) {
                this.fixes_releases.push(data.rows.item(i));
              }

              this.fixesDao.selectFixesIn("3", data => {
                let length = data.rows.length;

                for(let i = 0;i < length;i++) {
                  this.fixes_releases.push(data.rows.item(i));
                }

                load.dismiss();
              });
            });
          });
        });
      });
    });
  }
}
