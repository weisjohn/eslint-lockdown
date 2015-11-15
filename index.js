
var CLIEngine = require('eslint').CLIEngine;
var _ = require('lodash');

module.exports = function() {
    var cli = new CLIEngine({});

    var report = cli.executeOnFiles(['.']);

    var res = _(CLIEngine.getErrorResults(report.results))
        .pluck('messages')
        .flatten()
        .pluck('ruleId')
        .uniq()
        .value();

    console.log(res);

};
