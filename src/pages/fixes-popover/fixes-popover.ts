import { Component } from '@angular/core';
import { NavParams, ViewController, ModalController, ToastController, LoadingController, AlertController } from 'ionic-angular';

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
   * @param {NavParams}              navParams Biblioteca nativa para acesso a paramêtros passando para esta tela
   * @param {ViewController}         viewCtrl  Biblioteca nativa para controle das views
   * @param {ModalController}        modalCtrl Biblioteca nativa para controle de modais
   * @param {ToastController}        toastCtrl Biblioteca nativa para controle de toasts
   * @param {AlertController}        alertCtrl Biblioteca nativa para controle de alertas
   * @param {LoadingController}      loadCtrl  Biblioteca nativa para controle de alertas de carregamento
   * @param {FixesReleasesDAO}       fixesDao  Data Access Object de lançamentos fixos
   * @param {ClosedFixesReleasesDao} closedDao Data Access Object de lançamentos fixos pagos
   * @param {GlobalService}          global    Provider responsável pelas funções globais
   */
  constructor(public navParams: NavParams, public viewCtrl: ViewController,
  public modalCtrl: ModalController, public global: GlobalService,
  public fixesDao: FixesReleasesDAO, public toastCtrl: ToastController,
  public loadCtrl: LoadingController, public closedDao: ClosedFixesReleasesDao,
  public alertCtrl: AlertController) {}

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

        this.toastCtrl.create({
          position: "bottom",
          message: "Este lançamento ja foi fechado neste mês.",
          duration: 2000
        }).present();

        return false;
      }

      this.closedDao.closeFixesReleases(this.release, res => {
        load.dismiss();

        if(res.rowsAffected <= 0){
          this.toastCtrl.create({
            position: "bottom",
            message: "Não foi possível fechar este lançamento!",
            duration: 2000
          }).present();

          return false;
        }

        this.toastCtrl.create({
          position: "bottom",
          message: "Lançamento fechado com sucesso!",
          duration: 1500
        }).present();

        this.popoverDismiss(true);
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
        this.toastCtrl.create({
          position: "bottom",
          message: "Não foi possível deletar este lançamento!",
          duration: 2000
        }).present();

        return false;
      }

      this.toastCtrl.create({
        position: "bottom",
        message: "Lançamento deletado com sucesso!",
        duration: 1500
      }).present();

      this.popoverDismiss(true);
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
