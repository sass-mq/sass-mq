'use strict';

var fs = require('fs');
var sass = require('node-sass');
var Eyeglass = require('eyeglass');

var sassOptions = {
  file: './test/test-eyeglass.scss'
};
var eyeglass = new Eyeglass(sassOptions);

sass.render(eyeglass.sassOptions(), function(err, res){
  if (err) console.log(err);
  fs.writeFile('./test/test-eyeglass.css', res.css.toString(), function(err) {
    if (err) console.log(err);
    console.log('Wrote CSS to ./test/test-eyeglass.css');
  });
});
