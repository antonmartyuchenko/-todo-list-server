const http = require('http');
const messageService = require('./MessageService');
const express = require('./express');

const hostname = '127.0.0.1';
const port = 3000;
const router = express.Router;

const getUrlParameters = (pattern, url) => {
  const urlParameters = {};
  const arrayParameters = pattern.match(/:([a-zA-Z0-9_]+)/g);
  const regExpUrl = pattern.replace(new RegExp(`${arrayParameters.join('\\b|')}\\b`, 'g'), '([a-zA-Z0-9_-]+)');
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

router.get('/api/tasks', (req, res) => res.end(JSON.stringify(messageService.findAll())));

router.get('/api/tasks/:id', (req, res) => {
  const { id } = getUrlParameters('/api/tasks/:id', req.url);

  if (id < 0) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ errors: ['Enter message id'] }));
  }

  try {
    return res.end(messageService.findOne(id));
  } catch (e) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ errors: [e.message] }));
  }
});

router.post('/api/tasks', (req, res) => {
  parseRequestBody(req).then(body => {
    const { message } = body;

    if (!message) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter message id'] }));
    }

    return res.end(messageService.addMessage(message));
  }).catch(e => {
    res.statusCode = 400;
    return res.end(JSON.stringify({ errors: [e.message] }));
  });

  return '';
});

router.put('/api/tasks/:id', (req, res) => {
  const { id } = getUrlParameters('/api/tasks/:id', req.url);

  parseRequestBody(req).then(body => {
    const { message } = body;

    if (!message) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter message id'] }));
    }

    if (!id || id < 0) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ errors: ['Enter message id'] }));
    }

    return res.end(messageService.updateMessage(id, message));
  }).catch(e => {
    res.statusCode = 400;
    return res.end(JSON.stringify({ errors: [e.message] }));
  });

  return '';
});

router.delete('/api/tasks/:id', (req, res) => {
  const { id } = getUrlParameters('/api/tasks/:id', req.url);

  if (!id || id < 0) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ errors: ['Enter message id'] }));
  }

  try {
    return res.end(messageService.deleteMessage(id));
  } catch (error) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ errors: [error.message] }));
  }
});

const server = http.createServer((req, res) => {
  const { method, url } = req;

  const routerMethods = router.methods[method.toLowerCase()];

  for (const value of routerMethods) {
    const arrayParameters = value.pattern.match(/:([a-zA-Z0-9_]+)/g);

    if (arrayParameters) {
      const regExpUrl = value.pattern.replace(new RegExp(`${arrayParameters.join('\\b|')}\\b`, 'g'), '([a-zA-Z0-9_-]+)');

      if (new RegExp(regExpUrl.replace(/\//g, '\\/')).test(url)) {
        return value.callback(req, res);
      }
    } else if (url === value.pattern) {
      return value.callback(req, res);
    }
  }

  return res.end(JSON.stringify({ errors: ['Method not allowed'] }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
