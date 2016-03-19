# tweetping-connect
Connect to tweetping realtime channel

## Documentation

```
connect(<Number> streamId, <Function> onEvent, <Object> options)
```

### streamId

Number which represent the stream id you want to connect (ex: `1250`)

### onEvent

callback function: what's happening when you receive a new event from tweetping server.

this callback as 2 parameters:

* event type or service which emit this new event
* data


### options

Javascript plain object.

```js
const options = {
  sever: 'tweetping.net',
  services: ['wall', 'cities']
};
```

* server: server to connect. default: `tweetping.net`
* services: array of services you want to be receive notification in real-time. default `['raw']`

list of services:

* [wall](https://github.com/lightstream-company/wall-projection)
* ...


## Example

```js
import connect from 'tweetping-connect';

const options = {
 services: ['wall', 'cities' /*, ... */ ]
};
connect(1193, (service, data) => {
  console.log('from service: ' + service);
  console.log(data);
}, options);
```

