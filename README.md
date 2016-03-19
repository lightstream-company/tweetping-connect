# tweetping-connect
Connect to tweetping realtime channel

## Documentation

```
connect(<Number> streamId, <Function> onEvent, <Object> options)
```

### streamId

Number which represent the stream id you want to connect (ex: `1250`)

### onEvent

call back function: what's happening when you receive a new event from tweetping server


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
connect(1193, (post) => {
  console.log(post);
}, options);
```

