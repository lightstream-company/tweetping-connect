# tweetping-connect
Connect to tweetping realtime channel

## Usage

```js
import createConnection from 'tweetping-connect';

//setup a connection to stream "n3rd"
const {connect, load, info, permalink} = createConnection('n3rd');

//load wall history
load('wall').then(posts => console.log(posts));

//info on a stream
info().then(stream => console.log(stream.name));

//receive new posts in realtime
const close = connect('wall', data => console.log(data)});

//return permalink for the post with the _id "1337"
console.log(permalink(1337));

//close connection 1 min later
setTimeout(close, 60 * 1000);
```

