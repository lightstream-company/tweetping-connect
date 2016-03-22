# tweetping-connect
Connect to tweetping realtime channel

## Documentation

```
connect(<String|Number> streamId, <String> service, <Function> callback, <String> hostname)
```

return a function to close socket

### streamId

Number/String which represent the stream id you want to connect (ex: `1250`)

### service

list of services:

* [wall](https://github.com/lightstream-company/wall-projection)
* ...

### callback

Execute it each time you'll receive a new event from tweetping server.

### hostname

Server to connect - default: `tweetping.net`

## Example


```js
import connect from 'tweetping-connect';

const close = connect(1193, 'wall', (data) => {
  console.log(data);
});


//close connection 20s later
setTimeout(close, 20000);
```

