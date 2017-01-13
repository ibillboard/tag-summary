const TagSummary = require('./lib/TagSummary');
const Bluebird = require("bluebird");
const simpleGit = Bluebird.promisifyAll(require('simple-git')());

module.exports = new TagSummary(simpleGit);
