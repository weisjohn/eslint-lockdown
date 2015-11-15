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
    .option('--debug', '-D', 'Don\'t overwrite the `.eslintrc` file')
    .parse(process.argv);

function run(config, cb) {
    lockdown(cwd, config, function(err, config) {
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

function write(body, cb) {
    fs.writeFile(file, body, cb);
}

// all together now
read(function(err, config) {
    if (err || !config) config = {};
    run(config, function(err, config) {
        if (err) return console.error(err);
        var pretty = JSON.stringify(config, null, 4);
        if (program.debug) return console.log(pretty);
        write(pretty, function(err) {
            if (err) return console.error(err);
        });
    });
});
