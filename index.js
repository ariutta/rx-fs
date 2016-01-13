var _ = require('lodash');
var fs = require('fs');
var Rx = require('rx');
var RxNode = require('rx-node-extra');

// TODO not currently handling 'this' and prototypes
function rxifyNodeObject(inputObject) {
  return _.keys(inputObject)
    .reduce(function(accumulator, key) {
      var value = inputObject[key];
      if (typeof value === 'function') {
        if (key.indexOf('Sync') > -1) {
          accumulator[key] = value;
        } else if (key.indexOf('Stream') > -1) {
          accumulator[key] = value;
          /*
          var observableKey = key.replace('Stream', 'Observable');
          if (key.indexOf('Write') > -1) {
            accumulator[observableKey] = RxNode.fromWritableStream(value);
          } else {
            accumulator[observableKey] = RxNode.fromReadableStream(value);
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

var RxFs = rxifyNodeObject(fs);

RxFs.createReadObservable = function(path, options) {
  var stream = fs.createReadStream(path, options);
  options = options || {};

  var openSource = Rx.Observable.fromEvent(stream, 'open');
  var resultSource = RxNode.fromReadableStream(stream);
  resultSource.openSource = openSource;
  return resultSource;
};

module.exports = RxFs;
