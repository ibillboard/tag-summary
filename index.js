const TagSummary = require('./lib/TagSummary');
const Bluebird = require("bluebird");
const simpleGit = Bluebird.promisifyAll(require('simple-git')()).silent(true);

module.exports = new TagSummary(simpleGit);
