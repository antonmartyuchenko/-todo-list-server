const fs = require('fs');
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const addMessage = (message) => {
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
      return JSON.stringify(fileData.split('\n'));
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
    }
  }

  return null;
};


const deleteMessage = id => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');

      if (id >= messages.length) { throw new Error('Message has not been found'); }

      messages.splice(id, 1);

      fs.writeFileSync('log.txt', messages.join('\n'));
    }
  }

  throw new Error('Message has not been found');
};

const getRequestQueryParameters = url => url.split('?')[1];

const parseRequestBody = req => {
  let body = '';

  return new Promise((resolve, rejected) => {
    req.on('data', chunk => {
      body += chunk.toString();
    });

    if (body !== '') {
      resolve(body);
    }
  
    rejected(new Error('Request body not read'));
  });
};


const server = http.createServer((req, res) => {
  const { method } = req;


  if (method.toLowerCase() === 'get') {
    if (req.url.replace(/[/%]/g, '') === '') {
      return res.end(findAll());
    }

    const id = getRequestQueryParameters(req.url).split('=')[1];

    if (id === '' || id < 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter id message'] }));
    }

    if (id || id === 0) {
      try {
        return res.end(findOne(id));
      } catch (e) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ errors: [e.message] }));
      }
    } else {
      return res.end(findAll());
    }
  } else if (method.toLowerCase() === 'delete') {
    const id = getRequestQueryParameters(req.url).split('=')[1];

    if (id === '' || id < 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter id message'] }));
    }

    if (id || id === 0) {
      try {
        return res.end(deleteMessage(id));
      } catch (e) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ errors: [e.message] }));
      }
    }

    return '';
  } else if (method.toLowerCase() === 'post') {
    parseRequestBody(req).then(body => {
      const message = body.split(':')[1].replace(/[:"}%]/g, '').trim();

      if (!message) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ errors: ['Enter your message'] }));
      }

      return res.end(addMessage(message));
    }, e => {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: [e.message] }));
    });

    return '';
  } else {
    res.statusCode = 404;
    return res.end(JSON.stringify({ errors: ['Method not allowed'] }));
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
