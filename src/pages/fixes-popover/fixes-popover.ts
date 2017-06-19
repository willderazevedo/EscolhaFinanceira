import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController, AlertController, LoadingController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';
import { ClosedFixesReleasesDao } from '../../providers/dao/closed-fixes-releases-dao';

//Template Pages
import { FixesModalPage } from '../fixes-modal/fixes-modal';

//Pages
import { FixesReleasesPage } from '../fixes-releases/fixes-releases';

@Component({
  selector: 'page-fixes-popover',
  templateUrl: 'fixes-popover.html'
})
export class FixesPopoverPage {

  /**
   * Descrição do lançamento selecionado
   * @type {Object}
   */
  release     = this.navParams.get('release');

  /**
   * Modal de edição de lançamentos fixos
   * @type {Object}
   */
  fixes_modal = FixesModalPage;

  /**
   * Construtor da classe FixesPopoverPage
   * @param {NavParams}              public navParams Biblioteca nativa para acesso a paramêtros passando para esta tela
   * @param {ViewController}         public viewCtrl  Biblioteca nativa para controle das views
   * @param {ModalController}        public modalCtrl Biblioteca nativa para controle de modais
   * @param {AlertController}        public alertCtrl Biblioteca nativa para controle de alertas
   * @param {LoadingController}      public loadCtrl  Biblioteca nativa para controle de alertas de carregamento
   * @param {FixesReleasesDAO}       public fixesDao  Data Access Object de lançamentos fixos
   * @param {ClosedFixesReleasesDao} public closedDao Data Access Object de lançamentos fixos pagos
   * @param {GlobalService}          public global    Provider responsável pelas funções globais
   */
  constructor(public navParams: NavParams, public viewCtrl: ViewController,
  public modalCtrl: ModalController, public global: GlobalService,
  public fixesDao: FixesReleasesDAO, public alertCtrl: AlertController,
  public loadCtrl: LoadingController, public closedDao: ClosedFixesReleasesDao) {}

  public toggleModal() {
    let modal = this.modalCtrl.create(this.fixes_modal, {release: this.release});

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh){
        return false;
      }

      this.global.pageNavigation(FixesReleasesPage);
    });
  }

  /**
   * Método resposáel por perguntar ao usuário se ele realmente deseja excluir o lançamento
   * @returns {void}
   */
  public confirmDelete() {
    this.alertCtrl.create({
      message: "Você deseja deletar o lançamento: " + this.release.FIXES_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.deleteFixesRelease();
          }
        }
      ]
    }).present();
  }

  /**
   * Método responsável por perguntar ao usuário se ele deseja realmente fechar o lançamento do mês
   * @returns {void}
   */
  public confirmClose() {
    this.alertCtrl.create({
      message: "Você deseja fechar o mês deste lançamento: " + this.release.FIXES_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.closeFixesRelease();
          }
        }
      ]
    }).present();
  }

  /**
   * Método responsável pelo fechamento do mês do lançamento fixo
   * @returns {void|boolean}
   */
  private closeFixesRelease() {
    let load = this.loadCtrl.create({content:"Fechando Mês..."});
    load.present();

    this.closedDao.haveClosedInThisMonth(this.release.FIXES_ID, res => {

      if (res.rows.length > 0) {
        load.dismiss();

        this.alertCtrl.create({
          message: "Este lançamento ja foi fechado neste mês.",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.closedDao.closeFixesReleases(this.release, res => {
        load.dismiss();

        if(res.rowsAffected <= 0){
          this.alertCtrl.create({
            message: "Não foi possível fechar este lançamento!",
            buttons: ["Ok"]
          }).present();

          return false;
        }

        this.alertCtrl.create({
          message: "Lançamento fechado com sucesso!",
          buttons: [
            {
              text: "Ok",
              handler: () =>{
                this.popoverDismiss(true);
              }
            }
          ]
        }).present();
      });
    });
  }

  /**
   * Método responsável por deletar o lançamento fixo
   * @returns {void|boolean}
   */
  private deleteFixesRelease() {
    let load = this.loadCtrl.create({content:"Deletando Lançamento..."});

    load.present();
    this.fixesDao.delete(this.release.FIXES_ID, res => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.alertCtrl.create({
          message: "Não foi possível deletar este lançamento!",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.alertCtrl.create({
        message: "Lançamento deletado com sucesso!",
        buttons: [
          {
            text: "Ok",
            handler: () =>{
              this.popoverDismiss(true);
            }
          }
        ]
      }).present();
    });
  }

  /**
   * Método responsável por fechar o popover
   * @param {boolean} refresh Fechar e atualizar a listagm de fixos ou não
   */
  public popoverDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

}
