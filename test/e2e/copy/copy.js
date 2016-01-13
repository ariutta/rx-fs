// This should copy input.txt to output.txt

var rxFs = require('../../../index.js');

var inputPath = './input.txt';
var outputPath = './output.txt';

var source = rxFs.createReadObservable(inputPath);
var sink = rxFs.createWriteStream(outputPath);
source.pipe(sink);
