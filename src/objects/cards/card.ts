
import { CardResponse } from './cardresponse'

export class Card{

    //card state
    isFlagged : boolean = false;   
    isAnswerVisible : boolean = false;

    response : CardResponse = CardResponse.Undefined; 
    //aggregate state
    rightCount : number = 0;
    wrongCount : number = 0;
    skipCount : number = 0;

    //card properties

    /*** unique card id */
    //( id )

    /*** card number in the deck */
    number: number;        

    type : string;  //assume q&a card for now

    constructor(public id: string, public question : string, public answer : string){
    }

    static Create(){
        return new Card('','','');
    }

    public mark( value : CardResponse){
        if ( value == null || value == undefined)
            return;
    
        switch( value ){
            case CardResponse.Undefined:
                return;                

            case CardResponse.Right:               
                this.rightCount++; 
               break;
 
            case CardResponse.Wrong:
                this.wrongCount++;

            case CardResponse.Pass:
                this.skipCount++;

            break;
        }

        this.response = value;
    }
}