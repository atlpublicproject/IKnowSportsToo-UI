import {Deck} from './../decks/deck';

export class State{

    public items : any;

    public deck : Deck;
    public cardNumber : number;

    constructor(){
        this.items = { };
    }
}