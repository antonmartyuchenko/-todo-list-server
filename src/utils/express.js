const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const Router = {
  methods: {
    get: [],
    post: [],
    put: [],
    delete: []
  },

  get(pattern, callback) {
    this.methods.get.push({ pattern, callback });
  },

  post(pattern, callback) {
    this.methods.post.push({ pattern, callback });
  },

  put(pattern, callback) {
    this.methods.put.push({ pattern, callback });
  },

  delete(pattern, callback) {
    this.methods.delete.push({ pattern, callback });
  }
};

const getRequestQueryParameters = url => {
  const queryParameters = {};

  if (url.indexOf('?') !== -1) {
    for (const index of url.split('?')[1].split('&')) {
      const [parameter, value] = index.split('=');
      queryParameters[parameter] = value;
    }
  }

  return queryParameters;
};

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
      req.body = JSON.parse(bodyString);
    } else {
      req.body = null;
    }
    resolve();
  });
});

const prepareRequestParameters = (pattern, req) => {
  req.params = getUrlParameters(pattern, req.url);
  req.query = getRequestQueryParameters(req.url);
};

const createServer = () => {
  const server = http.createServer((req, res) => {
    res.send = response => {
      res.end(JSON.stringify(response));
    };

    const { method, url } = req;

    const routerMethods = Router.methods[method.toLowerCase()];

    parseRequestBody(req).then(() => {
      for (const value of routerMethods) {
        const arrayParameters = value.pattern.match(/:([a-zA-Z0-9_]+)/g);

        if (arrayParameters) {
          const regExpUrl = value.pattern.replace(new RegExp(`${arrayParameters.join('\\b|')}\\b`, 'g'), '([a-zA-Z0-9_-]+)');

          if (new RegExp(regExpUrl.replace(/\//g, '\\/')).test(url)) {
            prepareRequestParameters(value.pattern, req);

            return value.callback(req, res);
          }
        } else if (url === value.pattern) {
          return value.callback(req, res);
        }
      }

      return res.end(JSON.stringify({ errors: ['Method not allowed'] }));
    }).catch(e => {
      res.statusCode = 500;
      return res.end(JSON.stringify({ errors: [e.message] }));
    });
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};

module.exports = {
  Router,
  createServer
};
