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

module.exports = {
  Router
};
