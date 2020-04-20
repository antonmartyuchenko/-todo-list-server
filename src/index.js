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

  return JSON.stringify([]);
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

      return JSON.stringify([]);
    }
  }

  throw new Error('Message has not been found');
};

const updateMessage = (id, message) => {
  if (fs.existsSync('log.txt')) {
    const fileData = fs.readFileSync('log.txt', 'utf8');

    if (fileData) {
      const messages = fileData.split('\n');

      if (id >= messages.length) { throw new Error('Message has not been found'); }

      messages[id] = message;

      fs.writeFileSync('log.txt', messages.join('\n'));

      return JSON.stringify(message);
    }
  }

  throw new Error('Message has not been found');
};

/*
const getRequestQueryParameters = url => {
  const queryParameters = {};

  for (const index of url.split('?')[1].split('&')) {
    const [parameter, value] = index.split('=');
    queryParameters[parameter] = value;
  }

  return queryParameters;
};
*/

const getUrlParameters = (pattern, url) => {
  const urlParameters = {};
  const arrayParameters = pattern.match(/:([a-zA-Z0-9_]+)/g);
  const regExpUrl = pattern.replace(new RegExp(`${arrayParameters.join('|')}\\b`, 'g'), '([a-zA-Z0-9_-]+)');
  const arrayValues = url.match(new RegExp(regExpUrl.replace(/\//g, '\\/')));

  if (arrayValues) {
    for (let i = 0; i < arrayParameters.length; i++) {
      urlParameters[arrayParameters[i].slice(1)] = arrayValues[i + 1];
    }
  }

  return urlParameters;
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

  if (!(/^\/api\/tasks\b/).test(req.url)) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ errors: ['Method not allowed'] }));
  }

  const { id } = getUrlParameters('/api/tasks/:id', req.url);

  if (method === 'GET') {
    if (!id) {
      return res.end(findAll());
    }

    if (id < 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter id message'] }));
    }

    try {
      return res.end(findOne(id));
    } catch (e) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ errors: [e.message] }));
    }
  } if (method === 'DELETE') {
    if (!id || id < 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter id message'] }));
    }

    try {
      return res.end(deleteMessage(id));
    } catch (error) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ errors: [error.message] }));
    }
  } else if (method === 'POST') {
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
  } else if (method === 'PUT') {
    parseRequestBody(req).then(body => {
      const { message } = body;

      if (!message) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ errors: ['Enter your message'] }));
      }

      if (!id || id < 0) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ errors: ['Enter id message'] }));
      }

      return res.end(updateMessage(id, message));
    }).catch(e => {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: [e.message] }));
    });

    return '';
  }

  return res.end(JSON.stringify({ errors: ['Method not allowed'] }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
