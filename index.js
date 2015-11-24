var _ = require('lodash');
var fs = require('fs');
var Rx = require('rx');
var RxNode = require('../rx-node-extras/index.js');

// TODO not currently handling 'this' and prototypes
function rxifyNodeObject(inputObject) {
  return _.keys(inputObject)
    .reduce(function(accumulator, key) {
      var value = inputObject[key];
      if (typeof value === 'function') {
        if (key.indexOf('Sync') > -1) {
          accumulator[key] = value;
        } else if (key.indexOf('Stream') > -1) {
          //accumulator[key] = value;
          /*
          if (key.indexOf('Write') > -1) {
            accumulator[key] = RxNode.fromWritableStream(value);
          } else {
            accumulator[key] = RxNode.fromReadableStream(value);
          }
          //*/
        } else {
          accumulator[key] = Rx.Observable.fromNodeCallback(value);
        }
      } else if (_.isPlainObject(value)) {
        accumulator[key] = rxifyNodeObject(value);
      } else {
        accumulator[key] = value;
      }

      return accumulator;
    }, {});
}

var rxFs = rxifyNodeObject(fs);

rxFs.createReadObservable = function(path, options) {
  var stream = fs.createReadStream(path, options);
  options = options || {};
  return RxNode.fromReadableStream(stream);
};

rxFs.createWriteObservable = function(path, options) {
  var writeStream = fs.createWriteStream(path, options);

  return function(x, idx, source) {
    var output;
    if (_.isPlainObject(x) || _.isArray(x)) {
      output = JSON.stringify(x, null, '  ');
    } else {
      output = x;
    }
    writeStream.write(output);
  };
};

module.exports = rxFs;
