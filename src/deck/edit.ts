
import {inject} from 'aurelia-framework';
import { Card, Deck, DeckFactory, State } from './../objects/allobjects'
import {Router} from 'aurelia-router';
import {BootstrapFormRenderer} from './../resources/validation/bootstrap-form-renderer';
import {DeckStoreAPI} from './../storage/deck-store-api';

import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';


@inject(State, Router, ValidationControllerFactory, DeckStoreAPI)
export class Edit {
  deck : Deck;
  selectedCard : Number;

  /* new card properties */
  new_question : string;
  new_answer : string;

  constructor(private state: State,
              private router: Router,
              private validationControllerFactory : ValidationControllerFactory,
              private store : DeckStoreAPI)
              {

    if ( state.deck == null){
      this.router.navigateToRoute('decks');
    }
  
    this.deck =  state.deck;
    this.startValidation();   
  }

  /*** save deck to storage */
  saveDeck(){
    this.store.saveDeck( this.deck );

    alert("Deck Saved");
  }

  /*** route to index */
  goToIndex(){
    this.router.navigateBack();
  }
  
  saveNewCard(){
    this.controller.validate({ object: this })
      .then(
        (err) => {
          if ( err.length == 0 ){
            var card = new Card( null, this.new_question, this.new_answer);
            this.deck.addCard( card );
            
            alert("Card Added");

            this.new_question =
              this.new_answer =  "";

            // this.new_question.focus();
          }
      });
  }

  remove(card){
    this.deck.removeCard( card );
  }

  controller : any = null;
  startValidation(){
       this.controller = this.validationControllerFactory.createForCurrentScope();
       this.controller.addRenderer(new BootstrapFormRenderer());
      
          
        const rules = ValidationRules
                  .ensure("new_question")     
                  .displayName("Question")   
                      .minLength(5).maxLength(256).required()         
                       
                  .ensure("new_answer")    
                  .displayName("Answer")  
                      .minLength(5).maxLength(256).required()        
                      .rules;

        this.controller.addObject(this, rules);

  }
        
}
