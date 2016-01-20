# RxFs

This is an [RxJS](https://github.com/Reactive-Extensions/RxJS) wrapper for the Node.js **[fs module](https://nodejs.org/api/fs.html)**. It is intended to track the **fs** API as closely as possible, with the following exceptions:

* If the **fs** method expects a callback, the **RxFs** method instead returns an Observable.
* If the **fs** method creates a [stream](https://nodejs.org/api/stream.html), **RxFs** has an analogous method that creates an Observable, with `Stream` replaced by `Observable` in the name. Where you would use `pipe` for streams, you can use `let` for **RxFs**. For example, `RxFs.createReadStream` creates a stream and `RxFs.createReadObservable` creates an observable.
* The result from calling `fs.createReadObservable` has property `openSource`, which is an observable indicating the file has been opened.

Example: move `old.txt` to `new.txt`
```js
var RxFs = require('rx-fs');
var inputPath = './old.txt';
var outputPath = './new.txt';
var source = RxFs.createReadObservable(inputPath);
var sink = RxFs.createWriteObservable(outputPath);
return source
  .let(sink)
  .subscribeOnCompleted(function() {
    RxFs.unlink(inputPath).subscribeOnCompleted(done);
  });
```

Not all methods are currently fully tested. API may change to better reflect latest version of **fs** API. Pull requests welcome!

See also [this alternative](https://github.com/trxcllnt/rxjs-fs) that has a more full-featured API but does not match the current node fs API.
