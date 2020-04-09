const fs = require('fs');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const addMessage = (message) => {
  if (typeof message !== 'string' || message === '') { throw new Error('Enter your message'); }

  let lineBreak = '';

  if (fs.existsSync('log.txt') && fs.readFileSync('log.txt', 'utf8') !== '') {
    lineBreak = '\n';
  }

  fs.appendFileSync('log.txt', `${lineBreak}${message}`);

  return message;
};

const findAll = () => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      return fileData.split('\n');
    }
  }

  return [];
};

const findOne = id => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const message = fileData.split('\n')[id];

      if (message) {
        return message;
      }

      throw new Error('Message has not been found');
    }
  }

  return '';
};

const deleteMessage = id => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');

      if (id >= messages.length) { throw new Error('Message has not been found'); }

      messages.splice(id, 1);

      fs.writeFileSync('log.txt', messages.join('\n'));

      return 'done';
    }
  }
};

const server = http.createServer((req, res) => {
  const { method } = req;


  if (method.toLowerCase() === 'get') {
    const parametrs = req.url.split('?')[1];
    const id = parametrs.split('=')[1];

    console.log(id, typeof id);

    if (!id || id < 0) {
      res.statusCode = 400;
      res.end(JSON.stringify({errors: ['Enter id message']}));
    }

    if (id || id === 0) {
      try {
        res.end(findOne(id));
      } catch(e) {
        console.log(e);
        res.statusCode = 400;
        res.end(JSON.stringify({errors: [e.message]}));
      }
    } else {
      res.end(findAll());
    }
  } else if (method.toLowerCase() === 'delete') {
    const parametrs = req.url.split('?')[1];
    const id = parametrs.split('=')[1];

    if (id === true || id < 0) {
      res.statusCode = 400;
      res.end(JSON.stringify({errors: ['Enter id message']}));
    }

    if (id || id === 0) {
      res.end(deleteMessage(id));
    }

  } else if (method.toLowerCase() === 'post') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      message = body.split(':')[1].replace(/[:"}%]/g, '').trim();
      try {
        res.end(addMessage(message));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({errors: [e.message]}));
      }
    });
  } else { 
      res.statusCode = 404 ;
      res.end(JSON.stringify({errors: ['Method not allowed']}));
  };
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});