import { Component, ViewChild } from '@angular/core';
import { MenuController, Slides, AlertController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { ConfigPage } from '../config/config';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  @ViewChild("slidesComponent") slidesComponent: Slides;

  /**
   * Próximo slide
   * @type {Boolean}
   */
  skip   = true;

  /**
   * Slide anterior
   * @type {Boolean}
   */
  prev   = false;

  /**
   * Slides do tutorial
   * @type {Array}
   */
  slides = [
    {
      title: "Configuração",
      message: "Aqui você deverá colocar seus dados como seu nome e sua renda.",
      src: "assets/tutorial/1.jpg"
    },
    {
      title: "Painel Inicial",
      message: "Aqui no painel inicial você verá um resumo de suas movimentações.",
      src: "assets/tutorial/2.jpg"
    },
    {
      title: "Navegação",
      message: "O menu pode ser encontrado ao lado esquerdo com o icone das barrinhas use-o para navegar entre as páginas.",
      src: "assets/tutorial/3.jpg"
    },
    {
      title: "Lançamentos Diversos",
      message: "Nesta parte ficarão todos os lançamentos diversos que você criar divididos entre entrada e saída, aperte no mais para criar um novo.",
      src: "assets/tutorial/4.jpg"
    },
    {
      title: "Novo Diverso",
      message: "Estes são os campos para se criar um lançamento diverso, não esqueça nenhum hein.",
      src: "assets/tutorial/5.jpg"
    },
    {
      title: "Lançamentos Fixos",
      message: "Nesta parte ficarão todos os lançamentos fixos que você criar divididos também entre entrada e saída, aperte no mais para criar um novo.",
      src: "assets/tutorial/6.jpg"
    },
    {
      title: "Novo Fixo",
      message: "Estes são os campos para se criar um lançamento fixo.",
      src: "assets/tutorial/7.jpg"
    },
    {
      title: "Relatório",
      message: "Nesta área você poderar buscar informações dos seus lançamentos recentes ou antigos sendo eles pagos ou abertos.",
      src: "assets/tutorial/8.jpg"
    },
    {
      title: "Vejamos um Exemplo",
      message: "Veja um exemplo de uma compra no cartão que ainda nao foi paga.",
      src: "assets/tutorial/9.jpg"
    },
    {
      title: "Alterar Configurações",
      message: "Aqui você poderá alterar seu nome e sua renda caso queira.",
      src: "assets/tutorial/10.jpg"
    }
  ];

  /**
   * Página de configuração
   * @type {Object}
   */
  config = ConfigPage;

  /**
   * Construtor da classe TutorialPage
   * @param {MenuController}  menu      Biblioteca nativa responsável por controlar o menu
   * @param {AlertController} alertCtrl Biblioteca nativa responsável por controlar os alertas
   * @param {GlobalService}   global    Provider responsável pelas funções globais
   */
  constructor(public menu: MenuController, public global: GlobalService,
  public alertCtrl: AlertController) {
    this.menu.swipeEnable(false);
  }

  /**
   * Método nativo do ionic
   * @returns {void}
   */
  ionViewDidLoad() {
    this.slidesComponent.lockSwipes(true);
  }

  /**
   * Método responsável por pular o tutorial
   * @returns {void}
   */
  public confirmSkip() {
    this.alertCtrl.create({
      message: "Deseja mesmo pular o tutorial?",
      buttons: [
        {
          text: "Não"
        },
        {
          text: "Sim",
          handler: () => {
            this.global.pageNavigation(this.config);
          }
        }
      ]
    }).present();
  }

  /**
   * Método responsável voltar o slide
   * @returns {void}
   */
  public slidePrev() {
    this.slidesComponent.lockSwipes(false);
    this.slidesComponent.slidePrev();
    this.slidesComponent.lockSwipes(true);
  }

  /**
   * Método responsável passar o slide
   * @returns {void}
   */
  public slideNext() {
    this.slidesComponent.lockSwipes(false);
    this.slidesComponent.slideNext();
    this.slidesComponent.lockSwipes(true);
  }

  /**
   * Método responsável por esconder botão de próximo no último
   * @returns {void}
   */
  public slideWillChangeNext() {
    if((this.slidesComponent.getActiveIndex() - 2) >= (this.slides.length - 1)) {
      this.skip = false;

      return false;
    }

    this.skip = true;
  }

  /**
   * Método responsável por esconder botão de anterior no primeiro
   * @returns {void}
   */
  public slideWillChangePrev() {
    if(this.slidesComponent.getActiveIndex() === 0) {
      this.prev = false;

      return false;
    }

    this.prev = true;
  }
}
