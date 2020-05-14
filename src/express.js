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

module.exports = {
  Router, getUrlParameters, parseRequestBody
};
