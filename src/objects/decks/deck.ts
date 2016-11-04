import {Card} from '../cards/card'

export class Deck {
    topCard : Card;
    cardIx : number;
    cards : Card[];

    constructor(public id : string, public name: string, public description : string){        
        this.cardIx = 0;
        this.cards = new Array<Card>();
    }

    static Create() : Deck {
        return new Deck('','','',);
    }
    
    get cardCount():number {
        return this.cards.length;
    }

    public addCards(cards : Card[]){
        
        let _cardCount = this.cardCount;

        for( var i = 0; i < cards.length; i++){
            cards[i].number = _cardCount + i + 1;
            this.cards.push( cards[i] );
        }
    }

    public addCard( card : Card){        
        card.number = this.cardCount + 1;
        this.cards.push( card );
    }

    public removeCard( card : Card ){
        this.cards.splice(card.number-1 , 1);
        this.renumberCards();
    }

    renumberCards(){
        for(var i = 0; i < this.cards.length; i++)
            this.cards[i].number = i + 1;
    }

    previous(){
        this.cardIx = this.cardIx - 1;
        if ( this.cardIx < 0 ) this.cardIx = 0;
        return this.topCard = this.cards[ this.cardIx ];    
    }

    next(){
        this.cardIx = ( this.cardIx + 1 );
        if ( this.cardIx >=  this.cardCount ) this.cardIx = this.cardCount - 1;
        return this.topCard = this.cards[ this.cardIx ];
    } 

    // can implement diff strategy for previous, next
    // maybe queues for previous

    shuffle(){
        //algorithm from http://stackoverflow.com/a/25984542
        function _shuffle(a,b,c,d){//array,placeholder,placeholder,placeholder
            c=a.length;while(c)b=Math.random()*(--c+1)|0,d=a[c],a[c]=a[b],a[b]=d
        }

        _shuffle( this.cards, null, null, null);
    }

}
