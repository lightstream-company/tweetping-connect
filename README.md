# tweetping-connect
Connect to tweetping realtime channel

## Documentation

```
connect(<String|Number> streamId, <String> service, <Function> callback, <String> hostname)
```

return a stream (nodejs style)

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

### Callback style

```js
import connect from 'tweetping-connect';

connect(1193, 'wall', (data) => {
  console.log(data);
});
```

### Nodejs Stream Style

```js
import connect from 'tweetping-connect';

const stream = connect(1193, 'wall');

stream.on('data', message => console.log(message));
//or 
stream.pipe(process.stdout);

stream.on('error', err => console.log('disconnected :(' );

setTimeout(() => stream.end(), 10000); //close connection after 10s

```
