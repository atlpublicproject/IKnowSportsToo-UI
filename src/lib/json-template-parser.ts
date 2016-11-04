import * as _ from 'underscore';

/*** created to validate and parse question templates  */
export class JSONTemplateParser{
    
    data : any[];
    schema : string[];

    /*** true when able to parse text input into consistient json data */
    success : boolean = false;
    
    /*** error message */
    message: string = null;

    constructor( public text : string ){

        try{
            this.data = JSON.parse( text );
        }
        catch(e ){
            this.message = "Unable to parse JSON. Invalid format";
        }

        if (!Array.isArray( this.data ) || this.data.length < 1){
            this.message = "The JSON must be an array of objects.";
            return;
        }

        //check that all properties are the same in each object
        let obj_0 = this.data[0];
        let schema_props = _.allKeys( obj_0 );

        let i = 0;
        /* validate each array has the same props */
        for( let row of this.data){              
            if (! _.isEqual( schema_props, _.allKeys( row )) ){
                this.message = `The rows at indecies 0 and ${i} have different schemas. All rows must have the same schema`;
                return;
            }
            i++;
        }

        this.success = true;
    }

    IsSuccess(): boolean{
        return this.success;
    }

    /***  if the javascript table was valid and parseable returns null,
     *    otherwise returns an error message */
    Message() : string{
        return this.message;
    }

    GetData() : any[]{
        return this.data;
    }

    GetJSONSchema() : Array<string>{
        return this.schema;
    }
}