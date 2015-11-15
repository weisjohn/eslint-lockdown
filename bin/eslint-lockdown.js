#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package');
var lockdown = require('../');
var path = require('path');
var fs = require('fs');
var cwd = process.cwd();
var file = path.join(cwd, '.eslintrc');

program
    .version(pkg.version)
    .option('-d', '--debug', 'Don\'t overwrite the `.eslintrc` file')
    .parse(process.argv);

function run(config, cb) {
    lockdown(cwd, config, function(err, res) {
        if (err) return cb(err);
        return cb(null, config);
    });
}

function read(cb) {
    fs.access(file, fs.R_OK, function(err) {
        if (err) return cb(err);
        fs.readFile(file, function(err, file) {
            if (err) return cb(err);
            var config = {};
            try {
                config = JSON.parse(file);
            } catch (e) {
                return cb(e);
            }
            return cb(null, config);
        });
    });
}

function write(config, cb) {
    console.log('file', file);
    fs.writeFile(file, JSON.stringify(config, null, 4), cb);
}

// all together now
read(function(err, config) {
    if (err || !config) config = {};
    run(config, function(err, config) {
        if (err) return console.error(err);
        console.log(program);

        if (program.debug) return console.log(config);
        write(config, function(err) {
            if (err) return console.error(err);
        });
    });
});
