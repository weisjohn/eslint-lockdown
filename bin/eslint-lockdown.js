#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package');
var lockdown = require('../');

program.version(pkg.version).parse(process.argv);

lockdown(process.cwd(), function(err, res) {
    if (err) return console.error(err);
    console.log(JSON.stringify(res, null, 4));
});
