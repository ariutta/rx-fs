// This should copy input.txt to output.txt

var RxFs = require('../../../index.js');

var inputPath = './input.txt';
var outputPath = './output.txt';

var source = RxFs.createReadObservable(inputPath);
var sink = RxFs.createWriteStream(outputPath);
source.pipe(sink);
