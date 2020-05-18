const routerMessage = require('./messages');

const init = router => {
  routerMessage.init(router);
};

module.exports = {
  init
};
