import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';

//Providers
import { GlobalService } from '../../providers/global-service';

//Pages
import { ConfigPage } from '../config/config';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  slides = [
    {
      title: "Configuração",
      message: "Aqui você deverá colocar seus dados como se nome e sua renda.",
      src: "assets/tutorial/1.png"
    },
    {
      title: "Painel Inicial",
      message: "Aqui no painel inicial você verá um resumo de suas movimentações.",
      src: "assets/tutorial/2.png"
    },
    {
      title: "Navegação",
      message: "O menu pode ser encontrado ao lado esquerdo com o icone das barrinhas use-o para navegar entre as páginas.",
      src: "assets/tutorial/3.png"
    },
    {
      title: "Lançamentos Diversos",
      message: "Nesta parte ficarão todos os lançamentos diversos que você criar divididos entre entrada e saída, aperte no mais para criar um novo.",
      src: "assets/tutorial/4.png"
    },
    {
      title: "Novo Diverso",
      message: "Estes são os campos para se criar um lançamento diverso, não esqueça nenhum hein.",
      src: "assets/tutorial/5.png"
    },
    {
      title: "Lançamentos Fixos",
      message: "Nesta parte ficarão todos os lançamentos fixos que você criar divididos também entre entrada e saída, aperte no mais para criar um novo.",
      src: "assets/tutorial/6.png"
    },
    {
      title: "Novo Fixo",
      message: "Estes são os campos para se criar um lançamento fixo.",
      src: "assets/tutorial/7.png"
    },
    {
      title: "Relatório",
      message: "Nesta área você poderar buscar informções dos seus lançamentos recentes ou antigos sendo eles pagos ou abertos.",
      src: "assets/tutorial/8.png"
    },
    {
      title: "Vejamos um Exemplo",
      message: "Veja um exemplo de uma compra no cartão que ainda nao foi paga.",
      src: "assets/tutorial/9.png"
    },
    {
      title: "Alterar Configurações",
      message: "Aqui você poderá alterar seu nome e sua renda caso queira.",
      src: "assets/tutorial/10.png"
    }
  ];
  config = ConfigPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public menu: MenuController, public global: GlobalService) {
    this.menu.swipeEnable(false);
  }

}
