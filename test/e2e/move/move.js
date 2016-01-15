var crypto = require('crypto');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var RxFs = require('../../../index.js');

describe('mv input.txt output.txt', function() {
  var inputPath;
  var outputPath;
  var expectedHashValue;

  before(function() {
    inputPath = path.join(__dirname, 'input.txt');
    outputPath = path.join(__dirname, 'output.txt');
    expectedHashValue = '201e97fea0770ea06d99916b99b50d09';
  });

  beforeEach(function(done) {
    var outputText = fs.stat(outputPath, function(err, stat) {
      expect(err.code).to.equal('ENOENT');
      done();
    });
  });

  afterEach(function(done) {
    var outputText = fs.readFileSync(outputPath);
    var actualHash = crypto.createHash('md5');
    actualHash.update(outputText);
    var actualHashValue = actualHash.digest('hex');
    expect(actualHashValue).to.equal(expectedHashValue);

    // undo move to reset to initial state for next run
    fs.createReadStream(outputPath)
      .pipe(fs.createWriteStream(inputPath))
      .on('finish', function() {
        fs.unlinkSync(outputPath);
        done();
      });
  });

  it('should use pipe', function(done) {
    var source = RxFs.createReadObservable(inputPath);
    var sink = RxFs.createWriteStream(outputPath);
    source
      .pipe(sink)
      .on('finish', function() {
        RxFs.unlink(inputPath).subscribeOnCompleted(done);
      });
  });

  it('should use let', function(done) {
    var source = RxFs.createReadObservable(inputPath);
    var sink = RxFs.createWriteObservable(outputPath);
    return source
      .let(sink)
      .subscribeOnCompleted(function() {
        RxFs.unlink(inputPath).subscribeOnCompleted(done);
      });
  });

});
