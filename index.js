const fs = require('fs');
const parse = require('csv-parse');
const assert = require('assert');
const jsonToDot = require('json-to-dot');


const path = process.argv[2];



let myparse = (input, cb) => {
  console.log('about to parse' + input);
  parse(input, {
    comment: '#',
    relax_column_count: true,
    // columns: ['a','b','c','d','g'],
    // skip_lines_with_error: true,

  }, function(err, output) {
    cb(output);
    // console.log(output);
    // console.log(err);
    // assert.deepStrictEqual(
    //   output,
    //   [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
    // )
  })
}


let tojson = (o) => {
  let r = {};
  let level = [];
  // loop through and sort by indentation
  for(row of o) {
    const rl = row.length;
    // console.log(`${row} foo ${rl}`);
    if( typeof level[rl] === 'undefined' ) {
      // level[rl].push(row);
      level[rl] = []
    }
    level[rl].push(row);
    // console.log(`${rl}`);
  }

  // removes high levels equal to the number of default rows
  let check = 0;
  while(1) {
    if( typeof level[check] === 'undefined' ) {
      level.shift();
    } else {
      break;
    }
  }

  

  for(let i = 0; i < level.length; i++) {
    
  }



  console.log(level);
  return level;
}




fs.readFile(path, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
  myparse(data,(c)=>{
    const j = tojson(c);
    const dot = jsonToDot(j);
    console.log(dot);
  });
});



const dot = jsonToDot({
  foo: ['bar', 'buzz'],
  bar: ['foo'],
  norf: ['worble', 'buzz'],
  worf: ['worble'],
  fizz: ['buzz']   //  fizz->buzz
});


// console.log(dot);