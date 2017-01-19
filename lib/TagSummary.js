'use strict';

function TagSummary(simpleGit) {

    this.get = function (pluginConfig, options, cb) {

        return getCommitHash(options)
            .then(createSummary)
            .then(callCb);

        function getCommitHash(options) {
            return getTagCommitHash(options)
                .catch(getInitialCommitHash);
        }

        function getTagCommitHash(options) {
            const params = getParamsForTagCommitHash(options);
            return runGitRawCommand(params);
        }

        function getParamsForTagCommitHash(options) {
            const tag = options.pkg.name + '@' + options.pkg.version;
            return ['rev-list', '-n', 1, tag];
        }

        function runGitRawCommand(params) {
            return simpleGit.rawAsync(params);
        }

        function getInitialCommitHash() {
            const params = ['rev-list', '--max-parents=0', 'HEAD'];
            return runGitRawCommand(params);
        }

        function createSummary(commitHash) {
            return {
                version: options.pkg.version,
                gitHead: commitHash.trim(),
                tag: options.npm.tag
            };
        }

        function callCb(summary) {
            return cb(null, summary);
        }
    };
}

module.exports = TagSummary;