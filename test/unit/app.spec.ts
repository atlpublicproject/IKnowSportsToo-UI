import {QuestionFormulatingEngine} from '../../src/lib/question-formulator';
import {QandA} from '../../src/lib/question-formulator';

let data = 
    [
    {
    'team': 'New York Jets',
    'location': 'East Rutherford, NJ',
    'conference': 'NFC',
    'division' : 'East',
    'stadium_capacity': '60,0000'
    },
    {
    'team': 'New England Patriots',
    'location': 'Mass',
    'conference': 'AFC',
    'division' : 'East',
    'stadium_capacity': '80,0000'
    }
    ];

let templates = 
    [ 
        { q:'Which conference is {team} in?', a:'{conference}', g:''}, //no group = g:'{team}'},
        { q:'Which division is {team} in?', a:'{division}', g:''}, //no group, group = row , g:'{team}'
        { q:'Which division and conference is {team} in?', a:'{conference},{division}', g:''},
        { q:'Which teams are in {conference}',a:'{team}', g:"conference"},
        { q:'Which team(s) are in {state}', a:'{team}', g:'state'},
        { q:'Which conference are {team} in?', a:'{conference}', g:'conference'},
        { q:"This team is from {city} and in the {conference} {division}?", a:'{team}',g:''}
    ];


let template_0 = [ templates[0] ];

let simpleTemplates =  [ {q:"{a} and {b} went to ...", a:'{location}' },
                         {q:"My friends {a} and {b} went to ...", a:'{location}'},
                         {q:"{a} lives in ...", a:'{location}'}];
// per template
let simpleOptions = [{ group : '{location}', multi:false },
                     { multi : [[0,1], [2]] }];


let simpleData = [ { a:'Amanda', b:'Bill', location : 'Roswell'},
                   { a:'Gretchin', b:'Howard', location:'Sandy Springs'},
                   { a:'Cody', b:'Jane', location:'Sandy Springs'} ];


let generator = new QuestionFormulatingEngine();


  

describe('the question engine', () => {
  it('can fill a template', () => {
    expect( generator.fillTemplate( simpleData[0] , simpleTemplates[0]['q']).content )
     .toBe('Amanda and Bill went to ...');
  });

  it('generates cards for a template', () => {
    expect( JSON.stringify( generator.CreateCards( simpleData.slice(0,2), simpleTemplates[0]).content ))
       .toBe( JSON.stringify([
          new QandA('Amanda and Bill went to ...', 'Roswell'),
          new QandA('Gretchin and Howard went to ...', 'Sandy Springs')
       ]));
  });

  it('generates cards for a template with options', () => {
    expect( JSON.stringify( generator.CreateCards( simpleData.slice(0,3), simpleTemplates[1], simpleOptions[0]).content ))
       .toBe( JSON.stringify([
          new QandA('My friends Amanda and Bill went to ...', 'Roswell'),
          new QandA('My friends Cody and Gretchin and Howard and Jane went to ...', 'Sandy Springs'),
       ]));
  });

  it('generates cards for multi-data-row stacked templtes ', () => {
    expect( JSON.stringify(generator.CreateCards(
                simpleData.slice(0,3), simpleTemplates[2], simpleOptions[1] ).content ) )
     .toBe( JSON.stringify([
          new QandA('Amanda and Gretchin lives in ...', 'Roswell and Sandy Springs'),
          new QandA('Cody lives in ...', 'Sandy Springs')
     ]));
  });

});

describe('the question engine word joiner', () => {
  it('can handle one word', () => {
    expect( QuestionFormulatingEngine.JoinWords( ['A']) )
     .toBe('A')
  });

  it('can handle two words', () => {
    expect( QuestionFormulatingEngine.JoinWords( ['A','B']) )
     .toBe('A and B')
  });

  it('can handle three words', () => {
    expect( QuestionFormulatingEngine.JoinWords( ['A','B', 'C']) )
     .toBe('A, B and C')
  });
})

describe('the question engine index generator', () => {

  it('generates index arrays that contain all indecies', () => {
    expect( (() => {
      let arrays = QuestionFormulatingEngine.GenerateIndexArrays(10, 3);
      let values = new Array<number>();
      for( let arr of arrays ){
        values = values.concat(arr);
      }
      values.sort();
      return JSON.stringify( values );
    })()).toBe( ( () =>{
      let values = new Array<number>();
      for(let i = 0; i < 10; i++){ values.push( i ); }
      return JSON.stringify( values );
    })())
  })

  it('generates index arrays that contain all indecies', () => {
    expect( QuestionFormulatingEngine.GenerateIndexArrays(10, 3).length ).toBe(3)
  })

});
