import { Card, Deck, State, DeckFactory, CardResponse } from './../objects/allobjects'
import { Router } from 'aurelia-router';
import { inject } from 'aurelia-framework';
import { DeckStoreAPI } from './../storage/deck-store-api';
@inject( Router, State, DeckStoreAPI)
export class App {
  message = 'Professional Football Trivia';
  deck : Deck;
  card : Card;
  showAnswer : Boolean;
  showCommands : Boolean;
  isInTransition : Boolean;

  constructor( private router : Router, private state : State , private store : DeckStoreAPI) {       
      
      if ( state.deck == null){
        this.router.navigateToRoute('decks');
      }

      this.deck = state.deck;      
      this.showCommands = false;
      this.isInTransition = true;        
  }

  
  activate(params) {

      var id = 1;
      if ( params.id != null )
        id = params.id;

      this.state.cardNumber = id;
      this.card = this.deck.cards[id - 1];

      this.isInTransition = false;        
  }

  attached(){
    this.myKeypressCallback = this.keypressInput.bind(this); 
    window.addEventListener('keydown', this.myKeypressCallback, false);
  }
  detached(){
    window.removeEventListener('keydown', this.myKeypressCallback);

  }

  myKeypressCallback( e ){ } //placeholder function  
  keypressInput(e) {  // This function is called by the aliased method
 
      //console.log(e);
      //if game not started ignore
      // if ( false )
      //   return;

      
      var letter = e.key.toLowerCase();
      switch( letter ){

        case 'f':
          this.flag(null);
          break;
        case 'y':
          this.right();
          break;
        case 'n':
          this.wrong();
          break;

        case 'p':
          this.pass();
          break;

        case 's':
          this.toggleAnswer();
          break;

        case ' ':
          this.toggleAnswer(true);
          break;

        case 'arrowleft' :
          this.previous();
          break;
        case 'arrowright':
          this.next();
          break;

        case 'h':
          this.toggleCommands();
          break;

        case 'r':
          this.goToReview()
      }
  }
 
  toggleCommands(){
    this.showCommands = !this.showCommands;
  }

  handleSwipe(e){
    console.log('swipe');
    console.log (e );
    //case ($event.direction)

  }

  handleTap(e){

    if ( e.hammerEvent.target.id != 'cardEl' && 
         e.hammerEvent.target.id != 'answer')
      return;

 
    console.log('tap');
    console.log(e);
    this.toggleAnswer();
  }

  flag(e){
     this.card.isFlagged = !this.card.isFlagged;
  }


  right(){
     this.respond( CardResponse.Right );
  }

  wrong(){
     this.respond( CardResponse.Wrong );
  }

  pass(){
     this.respond( CardResponse.Pass );
  }
  
  respond( response : CardResponse ){

    if ( this.isInTransition )
        return;

     this.card.mark( response );

     //animate response using class
     //wait a bit?
   
     this.isInTransition = true;
     //fade card ( opacity )
     window.setTimeout( x => this.next(), 200 );
     //go to next
  }

  previous(){
     this.card = this.deck.previous();
     this.router.navigateToRoute("play", { id : this.card.number});
  }

  next(){
     var next = this.deck.next();

     if ( this.card != next){
          this.card = next;
          this.router.navigateToRoute("play", { id : this.card.number});
      }else{        
        //do something to indicate card didnt change

      }

      this.isInTransition = false;
  }


  //reset card display
  reset (){
    this.unreveal();
  }

  //can encapsulate into card 
  // card.showAnswer
  // card.hideAnswer
  // card.resetCounters()
  // card.resetVisuals()?
  toggleAnswer( forceShow : boolean = false){
      this.card.isAnswerVisible = forceShow || !this.card.isAnswerVisible ;
  }

  reveal(){
      this.card.isAnswerVisible = true;
  }

  unreveal(){
      this.card.isAnswerVisible = false;
  }


  clearAnswers(){
     for( let _card of this.deck.cards ){
       _card.response = CardResponse.Undefined;
       _card.isAnswerVisible = false;
     }
  }

  clearAnswersHistory(){
     this.clearAnswers();
     for( let _card of this.deck.cards ){
       _card.rightCount = 0;
       _card.wrongCount = 0;
       _card.skipCount = 0;
     }    
  }

  // game control
  goToReview(){
    this.router.navigateToRoute('review');  
  }

  goToIndex(){
    this.router.navigateToRoute('decks')
  }

  saveGame(){
    this.store
        .saveDeck( this.deck )
        .then( () => alert("Game Saved!") );
  }

}
