# tweetping-connect
Connect to tweetping realtime channel

## Example

```js
import connect from 'tweetping-connect';

const URL = 'ws://tweetping.net';
connect(1193, (post) => {
  console.log(post);
}, URL);
```

