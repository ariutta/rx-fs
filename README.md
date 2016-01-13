# RxFs

This is an [RxJS](https://github.com/Reactive-Extensions/RxJS) wrapper for the Node.js **[fs module](https://nodejs.org/api/fs.html)**. It is intended to track the **fs** API as closely as possible, with the following exceptions:

* If the **fs** method expects a callback, the **RxFs** method instead returns an Observable.
* If the **fs** method creates a [Readable stream](https://nodejs.org/api/stream.html#stream_class_stream_readable), **RxFs** has an analogous method that creates an Observable, with `Stream` replaced by `Observable` in the name. For example, `RxFs.createReadStream` creates a stream and `RxFs.createReadObservable` creates an observable.
* The result from calling `fs.createReadObservable` has property `openSource`, which is an observable indicating the file has been opened.

Note that Rx.Observable has a `pipe` method on its prototype, allowing for operations like this:

```js
var source = rxFs.createReadObservable(input);
var sink = rxFs.createWriteStream(output);
source.pipe(sink);
```

Not all the methods are currently supported. Pull requests welcome!

See also [this alternative](https://github.com/trxcllnt/rxjs-fs) that has a more full-featured API but does not match the current node fs API.
