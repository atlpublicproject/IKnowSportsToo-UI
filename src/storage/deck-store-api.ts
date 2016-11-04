import {Card, Deck, DeckHeader} from './../objects/allobjects'
import './deck-storage';
import 'underscore';

let latency = 200;
let id = 0;


/*** created to : search for remote desks, save deck to local stores */
export class DeckStoreAPI {
  isRequesting = false;
  
  /*** search for decks */
  search( searchText : string ) : Promise<DeckHeader[]>{   
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = deckHeaders;
       
        if ( !!searchText){ 
          let searchTextLower = searchText.toLowerCase();
          results = results
              .filter( x => { return x.name.toLowerCase().indexOf( searchTextLower ) > -1 
                                  || x.description.toLowerCase().indexOf( searchTextLower ) > -1 });
        }

        results.map(x =>  { return <DeckHeader>{
          id:x.id,
          name : x.name,
          description :  x.description,
          cardCount : x.cardCount
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  /*** search locally for my decks */
  searchLocal( searchText : string ) : Promise<DeckHeader[]>{   
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = decks;


        if ( !!searchText){ 
          let searchTextLower = searchText.toLowerCase();
          results = results
              .filter( x => { return x.name.toLowerCase().indexOf( searchTextLower ) > -1 
                                  || x.description.toLowerCase().indexOf( searchTextLower ) > -1 });
        }

        results = results        
        .map(x =>  { return <DeckHeader>{
          id:x.id,
          name : x.name,
          description :  x.description,
          cardCount : x.cards.length
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  /*** get a deck from the local cache */
  getLocalDeck(id : string) : Promise<Deck>{
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        
        //clone deck
        let deck  = decks.filter(x => x.id == id)[0];       
        let _deck = Object.assign( Deck.Create(), JSON.parse(JSON.stringify(deck)));

        //clone cards
        let cards = new Array<Card>();
        for( var ix = 0; ix < deck.cards.length; ix++ ){
          cards.push( Object.assign( Card.Create(), deck.cards[ix] ));
        }
        _deck.cards = cards;

        resolve( _deck );
        this.isRequesting = false;

      }, latency);
    });
  }

  /*** get a deck from the server */
  getDeck(id : string) : Promise<Deck>{
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let found = deckHeaders.filter(x => x.id == id)[0];       
        
        let deck = new Deck( found.id, found.name, found.description);
        for( let i = 0; i < found.cardCount; i++){
          var cd = getCardData();
          deck.addCard( new Card( cd.id, cd.question, cd.answer ) );
        }
         
        resolve( deck );
        this.isRequesting = false;
      }, latency);
    });
  }

  /*** save a deck to local decks cache && save it to server */
  saveDeck(deck : Deck){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(deck));

        //save it local
        let found = decks.filter(x => x.id == deck.id)[0];

        if(found){
          let index = decks.indexOf(found);
          decks[index] = instance;
        }else{
          instance.id = getUid();
          decks.push(instance);
        }
        saveDecks();

        //save it to server ( simulated ), it its not yours, clone it?
        let sFound = deckHeaders.filter(x => x.id == deck.id)[0];
        if(sFound){
          sFound.name = instance.name;
          sFound.decription = instance.description;
          sFound.cardCount = instance.cards.length; 
        }else{
          let dhInstance = {
            id : getUid(),
            name : instance.name,
            description : instance.description,
            cardCount : instance.cards.length
          };
          deckHeaders.push(dhInstance);         
        }

        saveDecks();
        this.isRequesting = false;

        resolve(instance);
      }, latency);
    });
  }

  /*** Delete a deck from local & server */
  deleteDeck(deck : Deck){
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
     
        //remove it local
        let index = _.findIndex(decks, x => x.id == deck.id )
        decks.splice( index, 1);        

        //remove iton the server to server ( simulated ), if its not yours, do nothing?
        let sIndex = _.findIndex(deckHeaders, x => x.id == deck.id );
        if(sIndex > 0){
          deckHeaders.splice(sIndex,1);
        }

        saveDecks();
        this.isRequesting = false;

        resolve();
      }, latency);
    });
  }

  //? save to server?
}
