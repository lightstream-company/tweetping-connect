import engineio from 'engine.io-client';
import Readble from 'stream';

const INITIAL_RETRY_TIMER = 100;
const STREAM_OPTIONS = {
  objectMode: true
};

export default function connect(id, service, callback, server = 'tweetping.net', timer = INITIAL_RETRY_TIMER, stream = new Readble(STREAM_OPTIONS)) {

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
    if(firstChar === '{' || firstChar == '['){
      try{
        data = JSON.parse(dataString);
      }catch(e){
        console.log(e);
      }
    }else if(!isNaN(floatParsed) && floatParsed.toString() === dataString){
      data = floatParsed;
    }
    if(typeof callback === 'function'){
      callback(data);
    }
    stream.push(data);
  }

  socket.once('open', () => {
    timer = INITIAL_RETRY_TIMER;
    socket.send(JSON.stringify(options));
  });

  socket.once('close', () => {
    socket.off('message', onReceiveData);
    if (timer < 1000000) {
      timer = timer * 10;
    }
    setTimeout(() => connect(id, service, callback, timer, stream), timer);
  });

  socket.on('message', onReceiveData);

  stream.once('end', () => socket.close());

  return stream;
}
