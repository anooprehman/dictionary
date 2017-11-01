import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CsvReaderProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CsvReaderProvider {

  csvItems : any[];
  kanjiItems : any[];

  constructor(public http: Http) {
    console.log('Hello CsvReaderProvider Provider');
  }

  loadCSV()
  {
    if(this.csvItems){
			return Promise.resolve(this.csvItems);
    }
    
    return new Promise(resolve => {
			this.http.get('./assets/data/enml.json').map(res => res.json()).subscribe(data => {
        this.csvItems = data;
				resolve(this.csvItems);
      })
    });

		/*return new Promise(resolve => {
			this.http.get('./assets/data/enml.csv').map(res => res.text()).subscribe(data => {
        this.csvItems = this.parseCSVFile(data);
				resolve(this.csvItems);
      })
    });*/
  }

  parseCSVFile(str)
  {
    var arr  = [],
        row,
        col,
        c,
        quote   = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (row = col = c = 0; c < str.length; c++)
    {
        var cc = str[c],
            nc = str[c+1];        // current character, next character

        arr[row]           = arr[row] || [];
        arr[row][col]  = arr[row][col] || '';

        /* If the current character is a quotation mark, and we're inside a
      quoted field, and the next character is also a quotation mark,
      add a quotation mark to the current column and skip the next character
        */
        if (cc == '"' && quote && nc == '"')
        {
          arr[row][col] += cc;
          ++c;
          continue;
        }


        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"')
        {
          quote = !quote;
          continue;
        }


        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == '\t' && !quote)
        {
          ++col;
          continue;
        }


        /* If it's a newline and we're not in a quoted field, move on to the next
          row and move to column 0 of that new row */
        if (cc == '\n' && !quote)
        {
          ++row;
          col = 0;
          continue;
        }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }

    return this.formatParsedObject(arr, true);
  }



  formatParsedObject(arr, hasTitles)
  {
    let english,
        malayalam,
        type,
        obj = [];

    for(var j = 0; j < arr.length; j++)
    {
        var items         = arr[j];

        if(items.indexOf("") === -1)
        {
          if(hasTitles === true && j === 0)
          {
              english   = items[1];
              type      = items[2];
              malayalam = items[3];
          }
          else
          {
              obj.push({
                english   : items[1],
                type      : items[2],
                malayalam : items[3]
              });
          }
        }
    }
    return obj;
  }
}
