describe('TagSummary', function () {
    let sinon, chai, expect;
    let TagSummary, tagSummary, bluebird, simpleGit;

    before(testToolsSetup);
    before(requireModules);

    describe('get', function () {
        let tagCommitHash, gitParams, cbParams;
        let cb, simpleGitStub;

        before(setupSharedProperties);
        beforeEach(setupSharedStubs);
        afterEach(() => simpleGitStub.restore());

        it('should call callback with params with tag hash', function () {
            return tagSummary.get({}, gitParams, cb)
                .then(function () {
                    expect(cb).to.be.calledOnce;
                    expect(cb).to.be.calledWith(null, cbParams);
                });
        });

        describe('when there is no tag in git repository', function () {

            beforeEach(setupForNoTagInRepo);

            it('should not be rejected', function () {
                const spy = tagSummary.get({}, gitParams, cb);
                return expect(spy).not.to.be.rejected;
            });

            it('should call callback with params contains first commit hash', function () {
                return tagSummary.get({}, gitParams, cb)
                    .then(function () {
                        expect(cb).to.be.calledOnce;
                        expect(cb).to.be.calledWith(null, cbParams);
                    });
            });
        });

        function setupSharedProperties() {
            gitParams = getGitParams();
            cbParams = getCbParams(gitParams);
        }

        function setupSharedStubs() {
            cb = sinon.spy();
            simpleGitStub = sinon.stub(simpleGit, "rawAsync");
            simpleGitStub.onCall(0).resolves('tagCommitHash\n');
        }

        function setupForNoTagInRepo() {
            simpleGitStub.onCall(0).rejects("Some error");
            simpleGitStub.onCall(1).resolves('initialCommitHash\n');
            cbParams.gitHead = 'initialCommitHash';
        }
    });

    function testToolsSetup() {
        sinon = require('sinon');
        require('sinon-as-promised');
        chai = require('chai');
        chai.use(require('sinon-chai'));
        chai.use(require("chai-as-promised"));
        expect = chai.expect;
    }

    function requireModules() {
        bluebird = require("bluebird");
        simpleGit = bluebird.promisifyAll(require('simple-git')());
        TagSummary = require('./TagSummary');
        tagSummary = new TagSummary(simpleGit);
    }

    function getGitParams() {
        return {
            pkg: {name: 'someName', version: 'someVersion'},
            npm: {tag: 'someNpmTag'}
        };
    }

    function getCbParams(gitParams) {
        return {
            version: gitParams.pkg.version,
            gitHead: 'tagCommitHash',
            tag: gitParams.npm.tag
        };
    }
});