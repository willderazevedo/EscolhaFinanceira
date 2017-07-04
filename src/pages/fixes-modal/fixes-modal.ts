import { Component } from '@angular/core';
import { NavParams, ViewController, LoadingController, ToastController, AlertController } from 'ionic-angular';

//Data Access Object
import { FixesReleasesDAO } from '../../providers/dao/fixes-releases-dao';

//Providers
import { TotoroBotService } from '../../providers/totoro-bot-service';
import { VarsService } from '../../providers/vars-service';

@Component({
  selector: 'page-fixes-modal',
  templateUrl: 'fixes-modal.html'
})
export class FixesModalPage {

  /**
   * Dados do lançamento para atualização
   * @type {Object}
   */
  release_update = this.navParams.get('release');

  /**
   * Dados para o novo ou atualizar o lançamento
   * @type {Object}
   */
  releases       = {
    id: "",
    name: "",
    value: "",
    type: 1,
  };

  /**
   * Construtor da classe FixesModalPage
   * @param {NavParams}         navParams Biblioteca nativa para acesso a paramêtros passando para esta tela
   * @param {ViewController}    viewCtrl  Biblioteca nativa para controle das views
   * @param {LoadingController} loadCtrl  Biblioteca nativa para controle de alertas de carregamento
   * @param {ToastController}   toastCtrl Biblioteca nativa para controle de toasts
   * @param {AlertController}   alertCtrl Biblioteca nativa para controle de alertas
   * @param {FixesReleasesDAO}  fixesDao  Data Access Obeject dos laçamentos fixos
   * @param {TotoroBotService}  totoroBot Provider do bot de tomada de decisões
   * @param {VarsService}       vars      Provider responsável pelas variáveis globais
   */
  constructor(public navParams: NavParams, public viewCtrl: ViewController,
  public loadCtrl: LoadingController, public toastCtrl: ToastController,
  public fixesDao: FixesReleasesDAO, public totoroBot: TotoroBotService,
  public vars: VarsService, public alertCtrl: AlertController) {
    this.populateRelease();
  }

  /**
   * Método responsável por checar se os campos estão vazios
   * @returns {boolean}
   */
  private checkFields() {
    let empty = false;
    let field = this.releases;

    if(!field.name || !field.value || parseFloat(field.value) == 0) {
      empty = true;
    }

    return empty;
  }

  /**
   * Método responsável por checar se a compra vai ser maior que a renda
   * @returns {boolean}
   */
  private checkValue() {
    let income       = this.vars.income;
    let invalidValue = false;

    if(parseFloat(this.releases.value) > income && this.releases.type == 0) {
      invalidValue = true;
    }

    return invalidValue;
  }

  /**
   * Método responsável pela gravação do lançamento
   * @returns {void|boolean}
   */
  public saveRelease() {
    let load         = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.fixesDao.insert(this.releases, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.toastCtrl.create({
          position: "bottom",
          message: "Não foi possível salvar este lançamento!",
          duration: 2000
        }).present();

        return false;
      }

      this.toastCtrl.create({
        position: "bottom",
        message: "Lançamento salvo com sucesso!",
        duration: 1500
      }).present();

      this.modalDismiss(true);
    });
  }

  /**
   * Método responsável por atualizar o lançamento
   * @returns {void|boolean}
   */
  public updateRelease() {
    let load         = this.loadCtrl.create({
      content: "Salvando informações...",
    });

    load.present();
    this.fixesDao.update(this.releases, (res) => {
      load.dismiss();

      if(res.rowsAffected <= 0){
        this.toastCtrl.create({
          position: "bottom",
          message: "Não foi possível salvar este lançamento!",
          duration: 2000
        }).present();

        return false;
      }

      this.toastCtrl.create({
        position: "bottom",
        message: "Lançamento salvo com sucesso!",
        duration: 1500
      }).present();

      this.modalDismiss(true);
    });
  }

  /**
   * Método responsável por popular campos para atualização
   * @returns {void|boolean}
   */
  private populateRelease() {

    if(!this.release_update) {
      return false;
    }

    this.releases.id    = this.release_update.FIXES_ID;
    this.releases.name  = this.release_update.FIXES_NAME;
    this.releases.type  = this.release_update.FIXES_TYPE;
    this.releases.value = this.release_update.FIXES_VALUE;
  }

  /**
   * Método responsável por da inicio a tomada de decisões (Caso Um)
   * @returns {void|boolean}
   */
  public initializeCaseOne() {
    let empty        = this.checkFields();
    let invalidValue = this.checkValue();

    if(empty){
      this.toastCtrl.create({
        position: "bottom",
        message: "Preencha todos os campos corretamente.",
        duration: 2000
      }).present();

      return false;
    }

    if(invalidValue){
      this.toastCtrl.create({
        position: "bottom",
        message: "O valor não deve ultrapassar sua renda.",
        duration: 2000
      }).present();

      return false;
    }

    this.totoroBot.caseOneFixes(this.releases, saveTip => {

      if(!saveTip) {
        this.initializeCaseTwo();

        return false;
      }

      this.alertCtrl.create({
        message: saveTip,
        buttons: [
          {text:"Cancelar"},
          {text:"Continuar", handler: () => this.initializeCaseTwo()}
        ]
      }).present();

    });
  }

  /**
   * Método responsável pelo caso dois da tomada de decisões
   * @returns {void|boolean}
   */
  private initializeCaseTwo() {
    this.totoroBot.caseTwoFixes(this.releases, saveTip => {

      if(!saveTip) {

        if(this.release_update) {
          this.updateRelease();

          return false;
        }

        this.saveRelease();

        return false;
      }

      this.alertCtrl.create({
        message: saveTip,
        buttons: [
          {text:"Cancelar"},
          {text:"Continuar", handler: () => this.release_update ? this.updateRelease() : this.saveRelease()}
        ]
      }).present();

    });
  }

  /**
   * Método reponsável por fechar a modal de cadastro
   * @param {boolean} refresh Atualizar ou nao a listagem quando a modal fechar
   */
  public modalDismiss(refresh = false) {
    this.viewCtrl.dismiss(refresh);
  }

}
