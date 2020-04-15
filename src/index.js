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

      return [];
    }
  }

  throw new Error('Message has not been found');
};

const getRequestQueryParameters = url => {
  const queryParameters = {};
  let parametr;
  let value;

  url.split('?')[1].split('&').forEach(element => {
    [parametr, value] = element.split('=');
    queryParameters[parametr] = value;
  });

  console.log(queryParameters);
  return queryParameters;
};

const parseRequestBody = req => new Promise((resolve, rejected) => {
  let bodyString = '';

  req.on('data', chunk => {
    bodyString += chunk.toString();
  });

  req.on('end', () => {
    if (bodyString) {
      resolve(JSON.parse(bodyString));
    } else {
      resolve(null);
    }
  });
});


const server = http.createServer((req, res) => {
  const { method } = req;

  if (method.toLowerCase() === 'get') {
    if (req.url.replace(/[/%]/g, '') === '') {
      return res.end(findAll());
    }

    const { id } = getRequestQueryParameters(req.url);

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
    }

    return res.end(findAll());
  } if (method.toLowerCase() === 'delete') {
    const { id } = getRequestQueryParameters(req.url);

    if (id === '' || id < 0 || id === undefined) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter id message'] }));
    }

    try {
      return res.end(deleteMessage(id));
    } catch (error) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ errors: [error.message] }));
    }
  } else if (method.toLowerCase() === 'post') {
    parseRequestBody(req).then(body => {
      const { message } = body;

      if (!message) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ errors: ['Enter your message'] }));
      }

      return res.end(addMessage(message));
    }).catch(e => {
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
