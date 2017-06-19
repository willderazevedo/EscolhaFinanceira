import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, AlertController, ModalController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Data Access Object
import { VariousReleasesDAO } from '../../providers/dao/various-releases-dao';
import { ClosedVariousReleasesDao } from '../../providers/dao/closed-various-releases-dao';


//Template Pages
import { VariousModalPage } from '../various-modal/various-modal';

//Pages
import { VariousReleasesPage } from '../various-releases/various-releases';

@Component({
  selector: 'page-various-popover',
  templateUrl: 'various-popover.html'
})
export class VariousPopoverPage {

  /**
   * Informações da release selecionada
   * @type {Object}
   */
  release       = this.navParams.get('release');

  /**
   * Texto de fechar ou pagar o lançamento
   * @type {String}
   */
  close_text    = "";

  /**
   * Modal de lançamentos diersos
   * @type {Object}
   */
  various_modal = VariousModalPage;

  /**
   * Construtor da classe VariousPopoverPage
   * @param {NavParams}                public navParams        Biblioteca nativa responsável por receber os parâmetros passados por outras páginas
   * @param {ViewController}           public viewCtrl         Biblioteca nativa responsável pelo controle das views
   * @param {LoadingController}        public loadCtrl         Biblioteca nativa responsável pelo controle dos alertas de carregamento
   * @param {AlertController}          public alertCtrl        Biblioteca nativa responsável pelo controle dos alertas
   * @param {ModalController}          public modalCtrl        Biblioteca nativa responsável pelo controle das modais
   * @param {VariousReleasesDAO}       public variousDao       Data Access Object de lançamentos diversos
   * @param {GlobalService}            public global           Provider responsável pelas funções globais
   * @param {ClosedVariousReleasesDao} public closedVariousDao Data Access Object de lançamentos diversos pagos
   */
  constructor(public navParams: NavParams, public viewCtrl: ViewController,
  public loadCtrl: LoadingController, public alertCtrl: AlertController,
  public variousDao: VariousReleasesDAO, public global: GlobalService,
  public modalCtrl: ModalController, public closedVariousDao: ClosedVariousReleasesDao) {}

  /**
   * Método nativo do ionic
   * @returns {void}
   */
  ionViewDidLoad() {
    this.setCloseText();
  }

  /**
   * Método responsável por fechar a popover
   * @param {void} refresh Atualizar listagem de lançamentos
   */
  public popoverDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

  /**
   * Método responsável por criar a modal para edição do lançamento
   * @returns {void|boolean}
   */
  public toggleModal() {
    let modal = this.modalCtrl.create(this.various_modal, {release: this.release});

    modal.present();
    modal.onDidDismiss(refresh => {

      if(!refresh) {
        return false;
      }

      this.global.pageNavigation(VariousReleasesPage);
    });
  }

  /**
   * Método responsável por colocar o texto de acordo com as parcelas restantes ou lançamento avista
   * @returns {void|boolean}
   */
  public setCloseText() {
    this.variousDao.getRemainingPlots(this.release.VARIOUS_ID, res => {
      if(res.rows.item(0).REMAIN <= 1 || this.release.VARIOUS_TYPE == 1) {
        this.close_text = "Fechar lançamento";

        return false;
      }

      this.close_text = "Pagar parcela";
    });
  }

  /**
   * Método responsável por confimar deleção
   * @returns {void}
   */
  public confirmDelete() {
    this.alertCtrl.create({
      message: "Você deseja deletar o lançamento: " + this.release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.deleteVariousRelease();
          }
        }
      ]
    }).present();
  }

  /**
   * Método responsável por confimar pagamento
   * @returns {void}
   */
  public confirmClose() {
    this.alertCtrl.create({
      message: "Você deseja fechar o lançamento: " + this.release.VARIOUS_NAME + "?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.closeVariousRelease();
          }
        }
      ]
    }).present();
  }

  /**
   * Método responsável por deletar o lançamento
   * @param {string}  successMsg Mensagem para sucesso da deleção
   * @param {string}  errMsg     Mensagem para erro na deleção
   * @param {boolean} hideLoad   Não mostrar load de carregamento
   * @param {boolean} forceDel   Forçar deleção
   * @returns {void|boolean}
   */
  private deleteVariousRelease(successMsg = "", errMsg = "", hideLoad = false, forceDel = false) {
    let load = this.loadCtrl.create({content:"Deletando Lançamento..."});

    successMsg = successMsg ? successMsg : "Lançamento deletado com sucesso";
    errMsg     = errMsg ? errMsg : "Erro ao deletar lançamento";

    if(!hideLoad) {
      load.present();
    }

    this.closedVariousDao.getPayVariousRelease(this.release.VARIOUS_ID, (res) => {
      if(res.rows.length > 0 && forceDel === false){
        load.dismiss();
        this.alertCtrl.create({
          message: "Não é possível remover este lançamento pois algumas parcelas já foram pagas.",
          buttons: [
            {
              text: "Ok",
              handler: () => {
                this.popoverDismiss();
              }
            }
          ]
        }).present();

        return false;
      }

      this.variousDao.delete(this.release.VARIOUS_ID, res => {
        load.dismiss();

        if(res.rowsAffected <= 0){
          this.alertCtrl.create({
            message: errMsg,
            buttons: ["Ok"]
          }).present();

          return false;
        }

        this.alertCtrl.create({
          message: successMsg,
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
   * Método responsável por decidir qual a forma de fechamento deste lançamento
   * @returns {void|boolean}
   */
  private closeVariousRelease() {

    if(this.release.VARIOUS_PAY_FORM == 0){
      this.doCloseInCard();

      return false;
    }

    this.doCloseNormal();
  }

  /**
   * Método responsável por fechar lançamentos avista ou entradas
   * @returns {void|boolean}
   */
  public doCloseNormal() {
    let load       = this.loadCtrl.create({content:"Fechando lançamento..."});
    let successMsg = "Lançamento fechado com sucesso.";
    let errMsg     = "Erro ao fechar lançamento";

    load.present();
    this.closedVariousDao.closeVariousRelease(this.release, res => {
      if(res.rowsAffected <= 0) {
        load.dismiss();
        this.alertCtrl.create({
          message: "Não foi possivel fechar este lançamento.",
          buttons: ["Ok"]
        }).present();

        return false;
      }


      load.dismiss();
      this.deleteVariousRelease(successMsg, errMsg, true, true);
    });
  }

  /**
   * Método responsável por fechar lançamentos no cartão
   * @returns {void|boolean}
   */
  public doCloseInCard() {
    let load       = this.loadCtrl.create({content:"Fechando lançamento..."});
    let successMsg = "Laçamento fechado com sucesso.";
    let errMsg     = "Erro ao fechar lançamento";

    load.present();
    this.closedVariousDao.haveClosedInThisMonth(this.release.VARIOUS_ID, res => {
      if(res.rows.length > 0) {
        load.dismiss();
        this.alertCtrl.create({
          message: "A parcela deste lançamento já foi paga este mês.",
          buttons: ["Ok"]
        }).present();

        return false;
      }

      this.closedVariousDao.closeVariousRelease(this.release, res => {
        if(res.rowsAffected <= 0) {
          load.dismiss();
          this.alertCtrl.create({
            message: "Não foi possivel pagar esta parcela.",
            buttons: ["Ok"]
          }).present();

          return false;
        }

        this.variousDao.getRemainingPlots(this.release.VARIOUS_ID, res => {
          if(res.rows.item(0).REMAIN == 1) {
            load.dismiss();
            this.deleteVariousRelease(successMsg, errMsg, true, true);

            return false;
          }

          this.variousDao.decreasePlots(this.release.VARIOUS_ID, res => {
            if(res.rowsAffected <= 0) {
              load.dismiss();
              this.alertCtrl.create({
                message: "Não foi possivel decrementar parcela.",
                buttons: ["Ok"]
              }).present();

              return false;
            }

            load.dismiss();
            this.alertCtrl.create({
              message: "Parcela paga com sucesso.",
              buttons: [
                {
                  text: "Ok",
                  handler: () => {
                    this.popoverDismiss(true);
                  }
                }
              ]
            }).present();
          });
        });
      });
    });
  }
}
