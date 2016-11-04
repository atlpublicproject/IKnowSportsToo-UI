
import {RouterConfiguration, Router} from 'aurelia-router';

export class App {
 router : Router;

 configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia';
    config.map([

      //deck screens - obj: locate  a deck to play with
      { route: ['', 'decks'], title:'Your Decks',   name: 'decks',       moduleId: 'deck/index', nav:true},
      //{ route: ['browse'],    name: 'browse',      moduleId: 'deck/browse' },
      //{ route: ['search'],    name: 'search',      moduleId: 'deck/search' },


      // required a deck to be selected
      { route: 'play/:id',         name: 'play',       moduleId: 'game/play' },
      { route: 'review',           name: 'review',     moduleId: 'game/review' },
      { route: 'edit',             name: 'edit',       moduleId: 'deck/edit' },
      { route: 'import',           name: 'import',       moduleId: 'deck/import' }
      //temp
      //{ route: 'files/*path',      name: 'files',      moduleId: 'files/index',   href:'#files',   nav: 0 }
     
    ]);
}


}
