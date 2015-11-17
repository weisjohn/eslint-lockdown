#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package');
var lockdown = require('../');
var path = require('path');
var fs = require('fs');
var cwd = process.cwd();
var file = path.join(cwd, '.eslintrc');
var _ = require('lodash');

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

            try {
                return cb(null, JSON.parse(file));
            } catch (e) {
                return cb(e);
            };

        });
    });
}

function write(body, cb) {
    fs.writeFile(file, body, cb);
}

function prettify(config) {

    // simple store for replacement tokens
    var replaces = [];

    // delimiter by which we inject placeholder to find on the .replace sweep
    var delimiter = '[[[__]]]';

    var pretty = JSON.stringify(config, function replacer(key, value) {

        // if the value isn't an array, let JSON handle it
        if (!_.isArray(value)) return value;

        // insert a delimiter and index into the string, store the value
        return delimiter.replace('__', replaces.push(value) - 1);

    }, 4);

    // find delimiter array references and replace
    return pretty.replace(/\"\[\[\[(\d)\]\]\]\"/g, function(match, $1) {
        // return the JSON representation
        return JSON.stringify(replaces[$1], null, ' ')
            // remove the new-lines and extra spaces
            .replace(/\n/g, ' ').replace(/  /g, ' ');
    });
}

// all together now
read(function(err, config) {
    if (err || !config) config = {};
    run(config, function(err, config) {
        if (err) return console.error(err);
        var pretty = prettify(config);
        if (program.debug) return console.log(pretty);
        write(pretty, function(err) {
            if (err) return console.error(err);
        });
    });
});
