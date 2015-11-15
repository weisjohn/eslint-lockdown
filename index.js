
var CLIEngine = require('eslint').CLIEngine;
var _ = require('lodash');

module.exports = function(cwd, config, cb) {

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

    config.rules = _.assign(config.rules || {}, rules);

    cb(null, config);
};
