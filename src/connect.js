import engineio from 'engine.io-client';

const INITIAL_RETRY_TIMER = 100;

function defaultUrl() {
  if (typeof window !== 'undefined') {
    const {location} = window.document;
    return 'wss://' + (location.hostname || location.host);
  } else {
    throw new Error('no default url found, explicit url is required');
  }
}

export default function connect(streamId, onMessage, url = defaultUrl(), timer = INITIAL_RETRY_TIMER) {
  const socket = engineio.Socket(url, {
    transports: ['websocket', 'polling']
  });

  function parse(json) {
    onMessage(JSON.parse(json));
  }

  socket.once('open', () => {
    timer = INITIAL_RETRY_TIMER;
    socket.send(streamId);
  });

  socket.once('close', () => {
    if (onMessage) {
      socket.off('message', parse);
    }
    if (timer < 1000000) {
      timer = timer * 10;
    }
    setTimeout(() => connect(streamId, onMessage, url, timer), timer);
  });

  if (onMessage) {
    socket.on('message', parse);
  }
}
