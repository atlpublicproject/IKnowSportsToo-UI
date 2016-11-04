
let id = 0;
/*** generate a unique id */
function getId() : number {
  return ++id;
}

/*** Creates a unique id for identification purposes. */
var getUid = function () {    
    var delim = "-";
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
};

/*** generate a random number between 1 and 45 */
function getCardCount(){
  return Math.floor(Math.random() * 45) + 1;
}

/*** generate random card data */
function getCardData() : any{
  return {
     id : getUid(),
     question : "This is a dummy question",
     answer : "This is an answer"
  };
}


let deckHeaders = [];
let decks = [];
loadDecks();

function saveDecks(){
    localStorage.setItem('decks', JSON.stringify(decks));
    localStorage.setItem('deckheaders', JSON.stringify(deckHeaders));
}

function loadDecks(){
    let deck_string = localStorage.getItem('decks')
    let deckheaders_string = localStorage.getItem('deckheaders')

    if ( deck_string !== null ){
        decks = JSON.parse(deck_string);
    } else {
        decks = [
            { 
                id : getUid(),
                name:'Easy Questions',
                description: 'These are questions a robot could answer.',
                cards :
                    [ 
                        {
                            id:getId(),
                            question : "How many fingers does a human have?",
                            answer : "Humans have 10 fingers",
                            number : 1
                        },
                        {
                            id:getId(),
                            question : "How many fingers and toes does a human have?",
                            answer : "A human has 10 fingers and 10 toes for a total of 20 digits.",
                            number : 2
                        },
                        {
                            id:getId(),
                            question : "When does the moon meet the sky?",
                            answer : "When the sun hides for a moment.",
                            number : 3
                        }
                    ]        
            },

            { 
                id : getUid(),
                name:'More Questions',
                description: 'These are questions a human could answer.',
                cards :
                    [ 
                        {
                            id:getId(),
                            question : "What is the square root of negative 1?",
                            answer : "sqrt(-1) = i",
                            number : 1
                        },
                        {
                            id:getId(),
                            question : "How many robots are there?",
                            answer : "How would I know?",
                            number : 2
                        },
                        {
                            id:getId(),
                            question : "Who won the superbowl in 1973.",
                            answer : "I dont know.",
                            number : 3
                        }
                    ]        
            }
        ];
    }

    if ( deckheaders_string !== null ){
        deckHeaders = JSON.parse(deckheaders_string);
    } else {


        deckHeaders = [
        {
            id : getUid(),
            name : "Raining Cats and Dogs",
            description : "My Mum say she likes all the same things that I do.",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "Greased Lightning",
            description : "Abstraction is often one floor above you.",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "Back to Square One",
            description : "Please wait outside of the house.",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "Fish Out Of Water",
            description : "Wednesday is hump day, has anyone asked the camel if he’s happy about it?",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "Wild Goose Chase",
            description : "He turned in the research paper on Friday.",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "When the Rubber Hits the Road",
            description : "She folded her handkerchief neatly.",
            cardCount : getCardCount()
        },
        {
            id : getUid(),
            name : "Don't Count Your Chickens Before They Hatch",
            description : "Italy is my favorite country.",
            cardCount : getCardCount()
        }
        ];
    }

    saveDecks();
}