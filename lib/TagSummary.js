'use strict';

function TagSummary(simpleGit) {

    this.get = function (pluginConfig, _ref, cb) {
        const npm = _ref.npm;
        const tag = _ref.pkg.name + '@' + _ref.pkg.version;
        const params = ['rev-list', '-n', 1, tag];

        return simpleGit.rawAsync(params)
            .then(createSummary)
            .then(callCb);

        function createSummary(commitHash) {
            return Object.defineProperties({
                version: _ref.pkg.version,
                gitHead: commitHash.trim()
            }, {
                tag: {
                    get: function get() {
                        console.log('deprecated', 'tag will be removed with the next major release');
                        return npm.tag;
                    },
                    configurable: true,
                    enumerable: true
                }
            });
        }

        function callCb(summary) {
            return cb(null, summary);
        }
    };
}

module.exports = TagSummary;