
var CLIEngine = require('eslint').CLIEngine;
var _ = require('lodash');

module.exports = function(cwd, conf, cb) {

    var cli = new CLIEngine({});
    var report = cli.executeOnFiles(['.']);

    // safety check
    if (!conf) conf = {};
    if (!conf.rules) conf.rules = {};

    _(CLIEngine.getErrorResults(report.results))
        .pluck('messages').flatten()
        .pluck('ruleId').uniq()
        .forEach(function(key) {

            // if a named rule is not specified, initialize it
            if (!conf.rules[key] || !_.isArray(conf.rules[key]))
                conf.rules[key] = [];

            // mark the rule as warn
            conf.rules[key][0] = 1;
        }).value();

    cb(null, conf);
};
