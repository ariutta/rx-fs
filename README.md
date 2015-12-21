# rx-fs

This is an [RxJs](https://github.com/Reactive-Extensions/RxJS) wrapper for the Node.js [fs module](https://nodejs.org/api/fs.html). It is intended to track the `fs` API as closely as possible, with the following exceptions:

* If the `fs` method expects a callback, the `rx-fs` method instead returns an Observable
* `Observable` replaces `Stream`

Not all the methods are currently supported. Pull requests welcome!

See also [this alternative](https://github.com/trxcllnt/rxjs-fs) that has a more full-featured API but does not match the current node fs API.
