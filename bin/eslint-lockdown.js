#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package');
var lockdown = require('../');

program.version(pkg.version).parse(process.argv);

lockdown();
