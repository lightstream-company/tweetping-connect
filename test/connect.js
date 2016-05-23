import test from 'tape';
import createConnection from '../src/connect';

test('default conf', ({equal, end}) => {

  const {permalink} = createConnection(42); 

  equal(permalink(1337), 'https://www.tweetping.net/redirect/stream/42/1337');
  end();
});

test('custom conf', ({equal, end}) => {

  const {permalink} = createConnection(42, {
    hostname: 'hq.tweetping.net'  
  }); 

  equal(permalink(1337), 'https://hq.tweetping.net/redirect/stream/42/1337');

  end();
});
