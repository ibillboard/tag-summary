const TagSummary = require('./TagSummary');
const Bluebird = require("bluebird");
const simpleGit = Bluebird.promisifyAll(require('simple-git')());
const sinon = require('sinon');
require('sinon-as-promised');

describe('TagSummary', function () {
    describe('get', function () {
        let gitParams, cbParams, tagSummary, cb;
        beforeEach(setupForGetLatestTag);

        it('should return call callback with correct params', function () {
           return tagSummary.get({}, gitParams, cb).then(function () {
               sinon.assert.calledOnce(cb);
               sinon.assert.calledWith(cb, null, cbParams);
           });
        });

        function setupForGetLatestTag() {
            const commitHash = 'someHash\n';
            cb = sinon.spy();
            gitParams = {
                pkg: {name: 'someName', version: 'someVersion'},
                npm: {tag: 'someNpmTag'}
            };
            cbParams = {
                version: gitParams.pkg.version,
                gitHead: 'someHash',
                tag: gitParams.npm.tag
            };
            sinon.stub(simpleGit, "rawAsync").resolves(commitHash);
            tagSummary = new TagSummary(simpleGit);
        }
    });
});