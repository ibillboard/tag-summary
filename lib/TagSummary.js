'use strict';

function TagSummary(simpleGit) {

    this.get = function (pluginConfig, _ref, cb) {
        const tag = _ref.pkg.name + '@' + _ref.pkg.version;
        const params = ['rev-list', '-n', 1, tag];

        return runGitCommand(params)
            .then(createSummary)
            .then(callCb);

        function runGitCommand(params) {
            return simpleGit.rawAsync(params);
        }

        function createSummary(commitHash) {
            return {
                version: _ref.pkg.version,
                gitHead: commitHash.trim(),
                tag: _ref.npm.tag
            };
        }

        function callCb(summary) {
            return cb(null, summary);
        }
    };
}

module.exports = TagSummary;