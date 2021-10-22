
import fs from 'fs';
import parse from 'csv-parse';
import jsonToDot from 'json-to-dot';
import {serializeGraph} from '@thi.ng/dot'

const path = process.argv[2];


// node type style presets
const terminal = {
    // color: "black",
    // fontcolor: "white",
    shape: "Mrecord",
};

// operator nodes use "Mrecord" shape
// with input and output port declarations
const operator = {
    fillcolor: "yellow",
    shape: "Mrecord",
    ins: { 0: "a", 1: "b" },
    outs: { "out": "out" }
};

const attribs = {
    rankdir: "LR",
    fontname: "Inconsolata",
    fontsize: 9,
    fontcolor: "gray",
    // label: "Build Tree",
    labeljust: "l",
    labelloc: "b",
    // node defaults
    node: {
        // style: "filled",
        fontname: "Inconsolata",
        fontsize: 11
    },
    // edge defaults
    edge: {
        arrowsize: 0.75,
        fontname: "Inconsolata",
        fontsize: 9
    }
};

const darkblue = '#4472C4';



let myparse = (input, cb) => {
  // console.log('about to parse' + input);
  parse(input, {
    comment: '#',
    relax_column_count: true,
    // columns: ['a','b','c','d','g'],
    // skip_lines_with_error: true,

  }, function(err, output) {
    // console.log(output);
    cb(output);
    // console.log(err);
    // assert.deepStrictEqual(
    //   output,
    //   [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ]
    // )
  })
}


let ovpToDot = (o) => {
  let r = {};
  let level = [];
  // loop through and sort by indentation
  for(let row of o) {
    const rl = row.length;
    // console.log(`${row} foo ${rl}`);
    if( typeof level[rl] === 'undefined' ) {
      // level[rl].push(row);
      level[rl] = []
    }

    // normalize each row now that we've recorded the depth
    let row2 = [];
    for(let val of row) {
      if( val !== '') {
        // and remove whitespace
        row2.push(val.trim());
      }
    }

    level[rl].push(row2);
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


  let nodes = {

  };
  let edges = [];


// graph nodes (the keys are used as node IDs)
// use spread operator to inject style presets
const nodes2 = {
    x:   { ...terminal, label: "x (12)" },
    y:   { ...terminal, label: "y (23)" },
    res: { ...terminal, label: "result (8050)", peripheries: 2 },
    op1: { ...operator, fillcolor: "green", label: "op1\n(+)" },
    op2: { ...operator, label: "op2\n(*)" },
};
// graph edges (w/ optional ports & extra attribs)
const edges2 = [
    { src: "x", dest: "op1", destPort: 1 },
    { src: "y", dest: "op1", destPort: 0 },
    { src: "y", dest: "op2", destPort: 0, label: "xform", color: "blue" },
    { src: "op1", srcPort: "out", dest: "op2", destPort: 1 },
    { src: "op2", srcPort: "out", dest: "res"},
];



  // console.log(level);

  let state = {};


  for(let i = 0; i < level.length; i++) {
    // each indent level (2,3)
    let row = level[i];
    for(let j = 0; j < row.length; j++) {
      const entry = row[j];
      // each item at that indent
      const key = `${i}_${j}`;

      state[key] = {};

      let type = entry[0];

      // console.log("looking at entry " + entry + ' type ' + type);

      if(type === 'circleci' || type === 'github-actions' || type === 'gitlab-runner') {
        state[key].build = true;
      } else {
        state[key].build = false;
      }

      state[key].git = false;
      state[key].submodule = false;
      if(type === 'git') {
        state[key].git = true;
      }
      if(type === 'submodule') {
        state[key].git = true;
        state[key].submodule = true;
      }


      let name = '?????';
      if( state[key].build ) {
        name = type + ' ' + '#' + entry[2];
      } else if (type === 'git') {
        name = entry[1] + '\n' + entry[2];
      } else if (type === 'submodule') {
        name = entry[1] + '\n' + entry[2];
      }


      // create the node
      nodes[key] = { ...terminal, label: name };



      // =======================
      // search for links
      // FIXME this may need to be run in the loop a 2nd time

      let foundbuild = false;
      // console.log('------');
      for(let x in state) {
        // console.log(x);

        // FIXME: only supports 9 inputs, replace this with a regex
        const isparent = x[0] === `${i-1}`;
        const issame = x[0] === `${i}`;

        if( issame ) {
          // we are git, they are build
          if( state[key].git === true && state[x].build === true) {
              edges.push(
                { src: key, dest: x, label: "trigger", color: "blue" },
              );
          }
        }

        if( isparent ) {
          // we are submodule, they are parent??
          // FIXME this is prone to breaking if we have multiple layers
          if( state[key].submodule === true && state[x].git === true) {
              edges.push(
                { src: key, dest: x, label: "submodule", color: darkblue },
              );
          }
        }
      }

    }
  }

  // console.log(nodes);
  // console.log(state);




  let dot2 = serializeGraph({
    directed: true, // default
    attribs,
    nodes,
    edges
  });


  return dot2;
}




fs.readFile(path, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  // console.log(data);
  myparse(data,(c)=> {
    // console.log('myparse');
    // console.log(c);

    
    const j = ovpToDot(c);
    console.log(j);
    // const dot = jsonToDot(j);
    // console.log(dot);
  });
});



// const dot = jsonToDot({
//   foo: ['bar', 'buzz'],
//   bar: ['foo'],
//   norf: ['worble', 'buzz'],
//   worf: ['worble'],
//   fizz: ['buzz']   //  fizz->buzz
// });


// console.log(dot);


// console.log(dot2);