const fs = require('fs');
const parse = require('csv-parse');
const assert = require('assert');


const path = process.argv[2];



let myparse = (input) => {
  console.log('about to parse' + input);
  parse(input, {
    comment: '#',
    relax_column_count: true,
    // columns: ['a','b','c','d','g'],
    // skip_lines_with_error: true,

  }, function(err, output){
    console.log(output);
    console.log(err);
    // assert.deepStrictEqual(
    //   output,
    //   [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
    // )
  })

}



fs.readFile(path, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
  myparse(data);
});




// const input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"'


// const name = 'foo';


// console.log(name);
