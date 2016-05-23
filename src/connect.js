import { format } from 'url';
import { join } from 'path';
import engineio from 'engine.io-client';
import fetch from 'isomorphic-fetch';

require('es6-promise').polyfill();

const INITIAL_RETRY_TIMER = 100;
const DEFAULT_OPTONS = {
  hostname: 'www.tweetping.net',
  protocol: 'https'
};

function parseJSONResponse(response) {
  if (response.status === 404) {
    return [];
  } else if (response.status >= 400) {
    throw new Error('Fetch geo history error');
  } else {
    return response.json();
  }
}

function fetchJSON(url) {
  return fetch(url).then(parseJSONResponse);
}


export default function createConnection(id, opt = {}) {
  const options = Object.assign({}, DEFAULT_OPTONS, opt);
  const {hostname, protocol} = options;

  function connect(service, callback, timer = INITIAL_RETRY_TIMER) {

    var timeout;

    const options = {
      stream: id,
      service: service
    };

    const webSocketUrl = format({
      protocol: (protocol === 'https') ? 'wss' : 'ws',
      slashes: true,
      hostname
    });

    const socket = engineio.Socket(webSocketUrl, {
      transports: ['websocket', 'polling']
    });

    function onReceiveData(dataString) {
      const firstChar = dataString.charAt(0);
      const floatParsed = parseFloat(dataString);
      var data = dataString;
      if (firstChar === '{' || firstChar == '[') {
        try {
          data = JSON.parse(dataString);
        } catch (e) {
          console.log(e);
        }
      } else if (!isNaN(floatParsed) && floatParsed.toString() === dataString) {
        data = floatParsed;
      }
      if (typeof callback === 'function') {
        callback(data);
      }
    }

    socket.once('open', () => {
      timeout = INITIAL_RETRY_TIMER;
      socket.send(JSON.stringify(options));
    });

    socket.once('close', () => {
      socket.off('message', onReceiveData);
      if (timer < 1000000) {
        timer = timer * 10;
      }
      timeout = setTimeout(() => connect(id, service, callback, timer), timer);
    });

    socket.on('message', onReceiveData);

    return function close() {
      clearTimeout(timeout);
      socket.close();
    };
  }

  function load(pathname, opt = {}) {
    return fetchJSON(format(Object.assign({
      pathname: join('data/stream', id.toString(), pathname)
    }, options, opt)));
  }

  function permalink(postId) {
    return format(Object.assign({
      pathname: join('redirect/stream', id.toString(), postId.toString())
    }, options));
  }

  return {
    connect,
    load,
    permalink
  };
}
