import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

//Chart
import { Chart } from 'chart.js';

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

  @ViewChild('hitoryVariousChart') hitoryVariousCanvas;
  @ViewChild('hitoryFixesChart') hitoryFixesCanvas;

  hitoryVariousChart:any;
  hitoryFixesChart:any;
  various_page           = VariousReleasesPage;
  fixes_page             = FixesReleasesPage;
  chart_various_data     = [];
  chart_fixes_data       = [];
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

  ionViewDidLoad() {
    this.variousDao.getOutCount(data => {
      let outCount = data.rows.item(0).VARIOUS_QUANTITY;

      this.variousDao.getInCount(data => {
        let inCount = data.rows.item(0).VARIOUS_QUANTITY;

        if(outCount == 0 && inCount == 0) {
          return false;
        }

        let inPercent  = (inCount * 100)/(inCount + outCount);
        let outPercent = (outCount * 100)/(inCount + outCount);

        this.chart_various_data = [inPercent.toFixed(2), outPercent.toFixed(2)];

        this.loadVariousChart(this.chart_various_data);

        this.fixesDao.getOutCount(data => {
          let outCount = data.rows.item(0).VARIOUS_QUANTITY;

          this.fixesDao.getInCount(data => {
            let inCount = data.rows.item(0).VARIOUS_QUANTITY;

            if(outCount == 0 && inCount == 0) {
              return false;
            }

            let inPercent  = (inCount * 100)/(inCount + outCount);
            let outPercent = (outCount * 100)/(inCount + outCount);

            this.chart_fixes_data = [inPercent.toFixed(2), outPercent.toFixed(2)];

            this.loadFixesChart(this.chart_fixes_data);
          });
        });

      });
    });
  }

  private loadVariousChart(data) {
    this.hitoryVariousChart = new Chart(this.hitoryVariousCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ["Entradas", "Saídas"],
          datasets: [{
            label: 'Relação de entradas e saídas',
            data: data,
            backgroundColor: [
                'rgba(93, 242, 137, 1)',
                'rgba(250, 101, 101, 1)',
            ],
            hoverBackgroundColor: [
                "#5df289",
                "#fa6565"
            ]
          }]
        }
    });
  }

  private loadFixesChart(data) {
    this.hitoryFixesChart = new Chart(this.hitoryFixesCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ["Entradas", "Saídas"],
          datasets: [{
            label: 'Relação de entradas e saídas',
            data: data,
            backgroundColor: [
                'rgba(93, 242, 137, 1)',
                'rgba(250, 101, 101, 1)',
            ],
            hoverBackgroundColor: [
                "#5df289",
                "#fa6565"
            ]
          }]
        }
    });
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
