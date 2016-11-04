
import {inject} from 'aurelia-framework';
import {Card, Deck, DeckFactory, State } from './../objects/allobjects'
import {Router} from 'aurelia-router';
import {BootstrapFormRenderer} from './../resources/validation/bootstrap-form-renderer';
import {DeckStoreAPI} from './../storage/deck-store-api';
import 'Papa';

import  { QuestionFormulatingEngine, QandA, Result, UIResult, UIMessage}
  from './../lib/question-formulator';

import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';


@inject(State, Router, ValidationControllerFactory, DeckStoreAPI)
export class Import {
  deck : Deck;  


  /* import data */
  importFormat : string = 'json';
  importContent : string = 'table';
  importText : string;
  isDataRowBased : boolean;



  csv_delimiter : string = ',';
  question_prop : string = 'question';
  answer_prop : string = 'answer';

  json_props : any[];

  /*** cards to create */
  cards : Card[];
  importTemplates : any[] = [];

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

    
    this.cards = new Array<Card>(); 
  }

  /*** import => parse tabular data */
  importTable(){
    //parse table data
  }

  /*** save new cards to deck */
  saveDeck(){
    this.store.saveDeck( this.deck );
  }

  saveNewCard(){
    this.controller.validate({ object: this })
      .then(
        (err) => {
          if ( err.length == 0 ){
  

          }
      });
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

  importText_Change(){
    this.enableCreateCards = false;
  }

  parsedData : any[];
  enableCreateCards : boolean = false;

  /*** convert data into json format */
  parseData(){
    let jsonData = [];
    let errors = [];
    
    if ( this.importFormat == "json"){     
        try{
          jsonData = JSON.parse( this.importText);
        }catch(ex){
          errors.push( ex.toString() );
        }
    } else if ( this.importFormat == "csv"){
        let parserRes = Papa.parse( this.importText, { header: true })

        if ( parserRes.errors.length > 0){
          errors.push( parserRes.errors );
        } else {
          jsonData = parserRes.data;
        }
    }

    if ( errors.length > 0){
      this.enableCreateCards = false;
      alert( errors.join("\n"));
      return;
    }

    this.parsedData = jsonData;
    this.enableCreateCards = true;
    console.log( "Parsed Data");
  }


  csvJSON(csv){

      var lines=csv.split("\n");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<lines.length;i++){

          var obj = {};
          var currentline=lines[i].split(",");

          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }

          result.push(obj);

      }

      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
  }


  pasteImport_OnPaste($event){

     let  plain = $event.clipboardData.getData('text/plain').trim();

     plain = plain.replace('\r\n','\n');

     let objects = 
      this.isDataRowBased ? 
       this.textToObjectsTranspose( plain ) : 
       this.textToObjects( plain );

     this.importText = JSON.stringify( objects, null, ' ');
  }

  
 textToObjects(stringData){
    var objects = [];
    //split into rows
    var rows = stringData.split('\n');

    //Make columns
    let columns = rows[0].split('\t');

    //Note how we start at rowNr = 1, because 0 is the column row
    for (var rowNr = 1; rowNr < rows.length; rowNr++) {
        var o = {};
        var data = rows[rowNr].split('\t');

        //Loop through all the data
        for (var cellNr = 0; cellNr < data.length; cellNr++) {
            o[columns[cellNr]] = data[cellNr].trim();
        }

        objects.push(o);
    }

    return objects;
  }


  textToObjectsTranspose( stringData : string){
    let objects = [];
    //split into rows
    var rows = stringData.split('\n');

    //Make columns
    let columns = rows[0].split('\t');

    // create col_n - 1 objects
    for ( var colNum = 0; colNum < columns.length-1; colNum++){
      objects.push({});
    }

    for (var rowNbr = 0; rowNbr < rows.length; rowNbr++) {
        var row = rows[rowNbr].split('\t');
        let prop = row[0].trim();

        //Loop through all the property data
        for (var cellNbr = 1; cellNbr < row.length; cellNbr++) {
            objects[cellNbr-1][prop] = row[cellNbr].trim();
        }
    }

    return objects;
  }
        
  /*** sapmle data */
  shouldShowSampleData : boolean = false;
  importTextTempData : string;
  importTemplatesTempData : any[];
  showSampleDataChange($event){

    let isChecked = $event.target.checked;

    if ( isChecked ) {
      //store text, template values
      this.importTextTempData = this.importText; 
      this.importTemplatesTempData = this.importTemplates;
      this.tryShowSampleData();
    } else{

      //restore original data
      this.importText = this.importTextTempData;       
      this.importTemplates = this.importTemplatesTempData;
    }

  }

  tryShowSampleData(){
    if ( this.shouldShowSampleData ){
      let lookup = this.importFormat + '-' + this.importContent;
      this.importText = this.sampleData[ lookup ];

      let templatesLookup = this.importFormat + '-' + this.importContent + '-' + 'templates';
      this.importTemplates = this.sampleData[templatesLookup] || [];
    }
  }

  addTemplate(){
    this.importTemplates.splice(0,0, {q:'',a:'',filter:'', group:'', multi:''});
  }

  removeTemplate(t){
    let ix = _.indexOf( this.importTemplates, t);
    this.importTemplates.splice(ix, 1);
  }
  
  sampleData : any= {
'csv-qa':
`What is the eighth planet form the sun?,Neptune
What are the rocky planets in our solar system?, Mercury,, Venus,, Earth,, Mars`,

'csv-table':
`Planet,Distance from the sun (AU),Period of revolution,Period of rotation,Mass (earth = 1),Diameter (earth = 1),Number of satellites
Mercury,0.39,88 days,59 days,0.06,0.38,0
Venus,0.72,225 days,243 days,0.82,0.95,0
Earth,1,365 days,24 hours,1,1,1
Mars,1.52,687 days,25 hours,0.11,0.53,2
Jupiter,5.2,12 years,10 hours,317.89,11.19,63
Saturn,9.54,29 years,10 hours,95.15,9.44,61
Uranus,19.2,84 years,18 hours,14.54,4.1,27
Neptune,30.06,165 years,18 hours,17.23,3.88,14` ,

'csv-table-templates' :
  [
    {q: 'What is the period of revolution of {Planet}?', a:'{Period of Revolution}', filter:'', group : '', multi : ''},
    {q: 'How far is {Planet} from the sun', a:'{Distance from the sun (AU)}', filter:'', group : '', multi : '2'}
  ],

'json-qa':
`[
 { 
  "question" : "What is the eighth planet from the sun? ",
  "answer" : "Neptune"
 },
 { 
  "question" : "What are the rocky planets in our solar system?",
  "answer" : "Mercury, Venus, Earth, Mars"
 }
]`,

'json-table':
`[
{
  "Conf-Div": "AFC East",
  "Team": "Buffalo Bills",
  "Location": "Orchard Park,NY",
  "Coach": "Rex Ryan"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "Miami Dolphins",
  "Location": "Miami Gardens, FL",
  "Coach": "Adam Gase"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "New England Patriots",
  "Location": "Foxborough,MA",
  "Coach": "Bill Belichick"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "New York Jets",
  "Location": "East Rutherford, NJ",
  "Coach": "Todd Bowles"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Baltimore Ravens",
  "Location": "Baltimore, MD",
  "Coach": "John Harbaugh"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Cincinnati Bengals",
  "Location": "Cincinnati, OH",
  "Coach": "Marvin Lewis"
 }
]`,
'json-table-templates' : [
   { q:'What conference and division is {Team} in?', a: '{Conf-Div}', filter:'', group:'', multi:'' },
   { q:'Which teams are in {Conf-Div}?', a: '{Team}', filter:'', group:'{Conf-Div}', multi:'' }]
};


 doFootBallData() {
   this.importText = this.footballData.json;
   this.importTemplates = this.footballData.templates;
   this.parseData();
 }

 footballData: any = {
   json : `[
 {
  "Conf-Div": "AFC East",
  "Team": "Buffalo Bills",
  "Location": "Orchard Park,NY",
  "Coach": "Rex Ryan"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "Miami Dolphins",
  "Location": "Miami Gardens, FL",
  "Coach": "Adam Gase"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "New England Patriots",
  "Location": "Foxborough,MA",
  "Coach": "Bill Belichick"
 },
 {
  "Conf-Div": "AFC East",
  "Team": "New York Jets",
  "Location": "East Rutherford, NJ",
  "Coach": "Todd Bowles"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Baltimore Ravens",
  "Location": "Baltimore, MD",
  "Coach": "John Harbaugh"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Cincinnati Bengals",
  "Location": "Cincinnati, OH",
  "Coach": "Marvin Lewis"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Cleveland Browns",
  "Location": "Cleveland, OH",
  "Coach": "Hue Jackson"
 },
 {
  "Conf-Div": "AFC North",
  "Team": "Pittsburgh Steelers",
  "Location": "Pittsburgh, PA",
  "Coach": "Mike Tomlin"
 },
 {
  "Conf-Div": "AFC South",
  "Team": "Houston Texans",
  "Location": "Houston, TX",
  "Coach": "Bill O'Brien"
 },
 {
  "Conf-Div": "AFC South",
  "Team": "Indianapolis Colts",
  "Location": "Indianapolis,IN",
  "Coach": "Chuck Pagano"
 },
 {
  "Conf-Div": "AFC South",
  "Team": "Jacksonville Jaguars",
  "Location": "Jacksonville,FL",
  "Coach": "Gus Bradley"
 },
 {
  "Conf-Div": "AFC South",
  "Team": "Tennessee Titans",
  "Location": "Nashville, TN",
  "Coach": "Mike Mularkey"
 },
 {
  "Conf-Div": "AFC West",
  "Team": "Denver Broncos",
  "Location": "Denver, CO",
  "Coach": "Gary Kubiak"
 },
 {
  "Conf-Div": "AFC West",
  "Team": "Kansas City Chiefs",
  "Location": "Kansas City,MO",
  "Coach": "Andy Reid"
 },
 {
  "Conf-Div": "AFC West",
  "Team": "Oakland Raiders",
  "Location": "Oakland, CA",
  "Coach": "Jack Del Rio"
 },
 {
  "Conf-Div": "AFC West",
  "Team": "San Diego Chargers",
  "Location": "San Diego, CA",
  "Coach": "Mike McCoy"
 },
 {
  "Conf-Div": "NFC East",
  "Team": "Dallas Cowboys",
  "Location": "Arlington, TX",
  "Coach": "Jason Garrett"
 },
 {
  "Conf-Div": "NFC East",
  "Team": "New York Giants",
  "Location": "East Rutherford, NJ",
  "Coach": "Ben McAdoo"
 },
 {
  "Conf-Div": "NFC East",
  "Team": "Philadelphia Eagles",
  "Location": "Philadelphia,PA",
  "Coach": "Doug Pederson"
 },
 {
  "Conf-Div": "NFC East",
  "Team": "Washington Redskins",
  "Location": "Landover, MD",
  "Coach": "Jay Gruden"
 },
 {
  "Conf-Div": "NFC North",
  "Team": "Chicago Bears",
  "Location": "Chicago, IL",
  "Coach": "John Fox"
 },
 {
  "Conf-Div": "NFC North",
  "Team": "Detroit Lions",
  "Location": "Detroit, MI",
  "Coach": "Jim Caldwell"
 },
 {
  "Conf-Div": "NFC North",
  "Team": "Green Bay Packers",
  "Location": "Green Bay, WI",
  "Coach": "Mike McCarthy"
 },
 {
  "Conf-Div": "NFC North",
  "Team": "Minnesota Vikings",
  "Location": "Minneapolis,MN",
  "Coach": "Mike Zimmer"
 },
 {
  "Conf-Div": "NFC South",
  "Team": "Atlanta Falcons",
  "Location": "Atlanta, GA",
  "Coach": "Dan Quinn"
 },
 {
  "Conf-Div": "NFC South",
  "Team": "Carolina Panthers",
  "Location": "Charlotte, NC",
  "Coach": "Ron Rivera"
 },
 {
  "Conf-Div": "NFC South",
  "Team": "New Orleans Saints",
  "Location": "New Orleans,LA",
  "Coach": "Sean Payton"
 },
 {
  "Conf-Div": "NFC South",
  "Team": "Tampa Bay Buccaneers",
  "Location": "Tampa, FL",
  "Coach": "Dirk Koetter"
 },
 {
  "Conf-Div": "NFC West",
  "Team": "Arizona Cardinals",
  "Location": "Glendale, AZ",
  "Coach": "Bruce Arians"
 },
 {
  "Conf-Div": "NFC West",
  "Team": "Los Angeles Rams",
  "Location": "Los Angeles,CA",
  "Coach": "Jeff Fisher"
 },
 {
  "Conf-Div": "NFC West",
  "Team": "San Francisco 49ers",
  "Location": "Santa Clara,CA",
  "Coach": "Chip Kelly"
 },
 {
  "Conf-Div": "NFC West",
  "Team": "Seattle Seahawks",
  "Location": "Seattle, WA",
  "Coach": "Pete Carroll"
 }
]`,

 templates : 
 [
  { q:'What conference and division is {Team} in?', a: '{Conf-Div}', filter:'', group:'', multi:'' },
  { q:'Which teams are in {Conf-Div}?', a: '{Team}', filter:'', group:'', multi:'' }
 ]

 };


 createCards(){
   let rows = this.parsedData;
   let templates = this.importTemplates;

   if ( this.importContent == 'qa' ){
     //create questions from q/a parsed data
     let props = _.keys( rows[0] );
     for( let row of rows){
       this.cards.push( new Card(null, row[props[0]], row[props[1]]));
     }       

   }else{

     let engine = new QuestionFormulatingEngine(); //, QandA, Result, UIResult, UIMessage
     
     for( let t of templates ){
       let res = engine.CreateCards( rows, t, t);

       if ( true ){
         let resQandA = <Array<QandA>>res.content;
         for(let qa of resQandA){
           this.cards.push( new Card(null, qa.Q, qa.A));
         }
       }
      }
     //create questions using question formulator engine


   }
 }

 clearCards(){
   this.cards = [];
 }

 saveCards(){
   this.deck.addCards( this.cards );
   this.clearForm();
   console.log('Cards Added to Deck');
 }

 clearForm(){
   this.cards = [];
   this.importTemplates = [];
   this.importText = "";

 }

 /*** get sample datr out? into own files? hmmm */
}