
import {Card} from './../cards/card'
import {Deck} from './deck'

export class DeckFactory{

    createSampleDeck(){

        var deck = new Deck("D1", 'Easy Questions', 'These are questions a robot could answer.');

        var cards = new Array<Card>();
        cards.push( new Card("C1","How many fingers does a human have?", "Humans have 10 fingers") );
        cards.push( new Card("C2","How many fingers and toes does a human have?", "A human has 10 fingers and 10 toes for a total of 20 digits.") );
        cards.push( new Card("C3","When does the moon meet the sky?", "When the sun hides for a moment.") );

        deck.addCards( cards );

        return deck;
    }
}

/*
export class DeckMaker?

export class Shoe{
    decks : Deck[]

    constructor(){
        this.decks = new Array<Deck>();
    }
}
*/