
import {inject} from 'aurelia-framework';
import { Card, Deck, State, DeckHeader } from './../objects/allobjects'
import {Router} from 'aurelia-router';
import {DeckStoreAPI} from './../storage/deck-store-api';

@inject(State, Router, DeckStoreAPI)
export class Index {
  
  /*** search : decks result set */
  decks : DeckHeader[];
  /*** search : search text  */  
  searchText : string;
  searchLocation : string;
  
  constructor(private state: State, private router: Router, private store: DeckStoreAPI) {  
  }

  activate(){
    return this.search();
  }

  search() : Promise<DeckHeader>{

    let searchText = this.searchText;

    let _searchLocation = this._getSearchLocation();
    if ( _searchLocation === 'local'){
      return this.store.searchLocal( searchText )
          .then( res => { 
            this.decks = res;
          });
    }
    if ( _searchLocation === 'remote'){
      return this.store.search( searchText )
          .then( res => { this.decks = res; });
    }

  }

  _getSearchLocation() : string{
    return this.searchLocation == 'remote' ? 'remote' : 'local';
  }

  /*** go => direct to play game */
  goToPlay( deckNum ){

    this.getDeck( deckNum ).then(
      deck => {
          this.state.deck = deck;
          this.router.navigateToRoute("play",{id:"1"});
      });
  }

  /*** go => direct to edit screen */
  goToEdit( deckNum ){
    this.getDeck( deckNum )
        .then(
      deck => {
          this.state.deck = deck;
          this.router.navigateToRoute("edit");
      });
  }

  getDeck ( deckNum : string ) : Promise<Deck>{

    let promise = null;

    let _searchLocation = this._getSearchLocation();
    
    if ( _searchLocation === 'local'){
      promise = this.store.getLocalDeck( deckNum )
    }
    
    if ( _searchLocation === 'remote'){
      promise = this.store.getDeck( deckNum )
    }

    return promise;
  }

  deleteDeck( deckNum ){
    this.store.deleteDeck( deckNum )
      .then( () => this.search() );
  }

  goToNew(){
    //create new deck
    //load empty deck
    //navigate to deck
    this.state.deck = Deck.Create();
    this.router.navigateToRoute("edit");
  }
}
