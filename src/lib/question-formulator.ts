import * as _ from 'underscore';

export class UIMessage{
    message : string;
    messageType : string;
}

export class UIResult{
    content : any;
    messages : Array<UIMessage>;

    static Create( content? : any, message? : any ) : UIResult    {

        var res = new UIResult();

        if ( typeof(message) == 'UIMessage'){
           res.messages = new Array<UIMessage>();
           res.messages.push( message ); 
        }

        if ( typeof(message) == 'Array' && typeof(message[0]) == 'UIMessage'){
            res.messages = message;
        }

        res.content = content;

        return res;
    }
}

export class Result{
    /*** message type */

    static Success( content?: any, message? : string) : Result{
        var res = new Result();
        res.success = true;
        res.content = content;
        res.message = null;        
        return res;
    }

    static Info( content?: any, message? : string ) : Result{
        var res = new Result();
        res.success = true;
        res.message = message;
        res.content = content;
        return res;
    }

    static Fail( message : string ){
        var res = new Result();
        res.success = false;
        res.message = message;
        return res;
    }

    success : boolean;
    message : string;
    content : any;   
}


export class QandA{
    Q : string;
    A : string;

    constructor( q : string, a: string ){
        this.Q = q;
        this.A = a;
    }
}

export class QuestionFormulatingEngine{
        
    public CreateQACards( data : any[], template : any, options : any) : UIResult
    {
        //handle null
        // if data == null
        // if data.length == 0

        var results = new Array<QandA>(); 
        var messages = new Array<UIMessage>();
        //no groups -> 1 question per row;
            
        let q = template.q as string;
        //expected format : "Lorem {i} dolor al {b}"
    
        let a = template.a as string ;
        //expected format : "Lorem {i} dolor al {b}"

        // if multi-row option then combine mulitple row data into one row
        if ( options && options.multi ){

            let stackSize = 1;
            let stacks = new Array<Array<number>>();
            if ( typeof(options.multi)  == 'number' ){
                stacks = QuestionFormulatingEngine.GenerateIndexArrays( data.length, options.multi);
            }
            if ( options.multi instanceof Object ){
                stacks = options.multi;                
            }

            //rearrange / stack rows 
            let stackedData = [];
            for( let indexes of stacks )
            {                
                let dataStackRow = {};   
                for ( let prop in data[0]){             
                    dataStackRow[ prop ] = QuestionFormulatingEngine.JoinWords( 
                            _.pluck( data.filter( (el, ix) => { 
                                return _.contains( indexes, ix );
                            } ), prop) );           
                }                
                stackedData.push( dataStackRow); 
            }
         
            data = stackedData;
        }
        
        for( let row of data ){

            //get question
            let q_res = this.fillTemplate( row, q );

            //get answer
            let a_res = this.fillTemplate( row, a );
            
            if ( q_res.success && a_res.success){
                results.push( new QandA( q_res.content, a_res.content ));
            }
            
            if ( q_res.message )
                messages.push( new UIMessage())
        }

        return UIResult.Create( results, messages );
    }


    public CreateCards( data : any[], template : any, options? : any) : UIResult{
        
        let isGroup = (options && options.group);
        //expected format : "i, b" 
                
        var results = new Array<QandA>(); 
        var messages = new Array<UIMessage>();
        //no groups -> 1 question per row;

        if ( !isGroup ){
            return this.CreateQACards( data, template, options );            
        }

        //else do grouping logic
            
        let data_keys = _.allKeys( data[0] );

        // group parts

        let g = options.group.toString();
        var g_props = _.map( g.split(','), str => str.toString().trim().substring(1, str.toString().length-1) ); //trim '{}'
        
        // g_props :['a','b','c']
        // row     : {a:"foo", b:"bar", c:'baz'};

        let groups =
            _.groupBy(
                data,
                function(row) {
                    return  _.reduce( 
                        g_props,
                        function(memo, el){
                            var i_el = el.toString()
                            return memo + row[i_el] + '-'; },
                        ''
                    );
                }
            );

        let group_rows = [];

        
        //create question, answers for each group -> concat all non-group properties
        for( let group_key in groups){

            // concat non-group properties => make one eff
            let group = groups[group_key];
            let grouped_row = {};

            //for all props
            for ( let prop of data_keys){
                if ( _.contains(g_props, prop)){
                    grouped_row[prop] = group[0][prop];
                }else{
                    grouped_row[prop] = QuestionFormulatingEngine.JoinWords( _.pluck( group, prop).sort() );
                }
            }

            group_rows.push( grouped_row );
        }        
  
        return this.CreateQACards( group_rows, template, options);

    }

    /*** created to fill template with row data 
     *    returns a filled template
     *    replace( rowdata : { k:v, k2:v2 } , template : string ) 
     * 
     * @rowdata    { k:v, k2:v2 }
     * @template   "Lorem {i} dolor al {b}"
     **/    
    fillTemplate( rowData : {}, template: string) : Result {

        let matches = template.match(/\{[^{^}]+\}/g);
        
        //no matching fill-ins
        if (matches.length == 0)
            return Result.Info("There are no parameters in the template", template);
        
        // replace matches with prop values
        for( let match of matches ){
            let match_text = match.substring(1,match.length-1); //remove '{', '}'
            if ( !rowData[match_text] ){
                return Result.Fail('The template placeholder "' + match + '" is not a property in the JSON schema');
            }            

            template = template.replace( match, rowData[match_text]);
        }    

        return Result.Success(template);
    }

      
    static JoinWords( values : Array<string> ) : string{
        let strResult = '';

        if ( values.length == 0)
            return '';

        if ( values.length == 1)
            return values[0];

        for( let ix = 0; ix < values.length; ix++){
            if ( ix == 0 )
                strResult += values[ix]
            else if ( ix == values.length -1 )
                strResult += " and " + values[ix];
            else
                strResult += ", " + values[ix];
        }

        return strResult;
    }

   /*** given a number of cards c,  and cards per stack s, generates floor(c/s) arrays that
    * contain random selectoins of indecies */
    static GenerateIndexArrays( numberOfCards : number, stackSize : number  ) : Array<Array<number>>{

        let numStacks = Math.floor(numberOfCards / stackSize) || 1 ;//minimum number of stacks is 1
  
        let availableStacks = new Array<Array<number>>();
        let fullStacks = new Array<Array<number>>();

        for( let i = 0; i < numStacks; i++ )
            availableStacks[i] = new Array<number>();

        for ( let i = 0; i < numberOfCards; i++){
            
            if ( availableStacks.length == 0){
                //refill avail stacks from full if no stacks left
                availableStacks = fullStacks.splice(0, fullStacks.length-1);
            }

            let r = Math.floor(Math.random() * (availableStacks.length));            
            availableStacks[r].push( i );
            if( availableStacks[r].length >= stackSize )
                fullStacks.push(availableStacks.splice(r,1)[0]);
        }

        return availableStacks.concat(fullStacks);
    }

}
