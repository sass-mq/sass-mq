'use strict';

var fs = require('fs');
var sass = require('node-sass');
var eyeglass = require('eyeglass');
var path = require('path');

var sassOptions = {
    file: './test/test-eyeglass.scss'
};

sassOptions.eyeglass = {
    root: path.join(__dirname, '../'),
    buildDir: __dirname
};

sass.render(eyeglass(sassOptions), function(err, res){
    if (err) console.log(err);

    fs.writeFile('./test/output/test-eyeglass.css', res.css.toString(), function(err) {
        if (err) console.log(err);
    });
});
