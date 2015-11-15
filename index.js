
var CLIEngine = require('eslint').CLIEngine;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');

module.exports = function(cwd, cb) {
    var cli = new CLIEngine({});

    var report = cli.executeOnFiles(['.']);

    var rules = _(CLIEngine.getErrorResults(report.results))
        .pluck('messages')
        .flatten()
        .pluck('ruleId')
        .uniq()
        .reduce(function(prev, current) {
            prev[current] = [ 1 ];
            return prev;
        }, {});

    var p = path.join(cwd, '.eslintrc');

    fs.access(p, fs.R_OK, function(err) {
        if (err) return cb(err);
        fs.readFile(p, function(err, file) {
            if (err) return cb(err);
            var config = JSON.parse(file);

            config.rules = _.assign(config.rules || {}, rules);

            cb(null, config);
        });
    });

};
