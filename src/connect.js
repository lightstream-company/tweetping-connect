import engineio from 'engine.io-client';

const INITIAL_RETRY_TIMER = 100;

export default function connect(id, service, callback, server = 'tweetping.net', timer = INITIAL_RETRY_TIMER) {


  var timeout;

  const options = {
    stream: id,
    service: service
  };
  const socket = engineio.Socket(server, {
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

  return function close(){
    clearTimeout(timeout);
    socket.close();
  };
  
}
