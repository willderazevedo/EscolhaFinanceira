import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { VariousReleasesPage } from '../various-releases/various-releases';
import { FixesReleasesPage } from '../fixes-releases/fixes-releases';

@Component({
  selector: 'page-panel',
  templateUrl: 'panel.html'
})
export class PanelPage {

  various_page           = VariousReleasesPage;
  fixes_page             = FixesReleasesPage; 
  higher_various_release = [];
  higher_fixes_release   = [];
  various_releases       = [];
  fixes_releases         = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public menu: MenuController, public global: GlobalService,
  public fixesDao: FixesReleasesDAO, public variousDao: VariousReleasesDAO,
  public loadCtrl: LoadingController) {
    this.menu.swipeEnable(true);
    this.loadInformations();
  }

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
