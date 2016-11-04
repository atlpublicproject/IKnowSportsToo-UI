import { Deck, State } from './../objects/allobjects'
import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'

@inject( State, Router )
export class Review{
    questionCount : number;
    correctAtLeastOnceCount : number;
    neverCorrectCount :number;
    noJudgementCount : number;
    deck :Deck;

    constructor( private state : State, private router : Router ){

        if ( this.state.deck === undefined ){
            this.goToGame();
        }else{
            this.deck = this.state.deck;
        }
    }

    goToGame(){
        this.router.navigateToRoute('play', {id:'1'});
    }

    activate(){
        this.computeThings();
    }

    computeThings(){
        
        var cards = this.state.deck.cards;

        this.questionCount  = cards.length;
        this.correctAtLeastOnceCount = 0;
        this.neverCorrectCount = 0;
        this.noJudgementCount = 0;
        
        for(let i = 0; i < cards.length; i++ ){

            var card = cards[i];

            if ( card.rightCount > 0 )
                this.correctAtLeastOnceCount++;
            else
                if ( card.wrongCount > 0)
                    this.neverCorrectCount++;
                else
                    if ( card.skipCount > 0 )
                        this.noJudgementCount++;
                        
        }


    }


 // use base class to add keybindings, override kepress thing
 attached(){
    this.myKeypressCallback = this.keypressInput.bind(this); 
    window.addEventListener('keydown', this.myKeypressCallback, false);
  }
  detached(){
    window.removeEventListener('keydown', this.myKeypressCallback);

  }

  myKeypressCallback( e ){ } //placeholder function  
  keypressInput(e) {  // This function is called by the aliased method
    var letter = e.key.toLowerCase();
    
    switch( letter ){
        case 'arrowleft':
        case 'backspace':
            this.goToGame();
            break;
    }

  }
}


