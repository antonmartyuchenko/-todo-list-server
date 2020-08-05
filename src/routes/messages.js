const { messageService } = require('../service');

const init = router => {
  router.get('/api/tasks', (req, res) => messageService.findAll()
    .then((messages) => { res.send(messages); })
    .catch(e => {
      res.statusCode = 404;
      res.send({ errors: [e.message] });
    }));

  router.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    if (id < 0) {
      res.statusCode = 400;
      return res.send({ errors: ['Enter message id'] });
    }

    return messageService.findOne(id)
      .then((message) => { res.send(message); })
      .catch(e => {
        res.statusCode = 404;
        res.send({ errors: [e.message] });
      });
  });

  router.post('/api/tasks', (req, res) => {
    const { message } = req.body;

    if (!message) {
      res.statusCode = 400;
      return res.send({ errors: ['Enter message'] });
    }

    return messageService.addMessage(message)
      .then((newMessage) => { res.send(newMessage); })
      .catch(e => {
        res.statusCode = 404;
        res.send({ errors: [e.message] });
      });
  });

  router.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      res.statusCode = 400;
      return res.send({ errors: ['Enter message'] });
    }

    if (!id || id < 0) {
      res.statusCode = 400;
      return res.send({ errors: ['Enter message id'] });
    }

    return messageService.updateMessage(id, message)
      .then((newMessage) => { res.send(newMessage); })
      .catch(e => {
        res.statusCode = 404;
        res.send({ errors: [e.message] });
      });
  });

  router.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;

    if (!id || id < 0) {
      res.statusCode = 400;
      return res.send({ errors: ['Enter message id'] });
    }

    return messageService.deleteMessage(id)
      .then(() => { res.send(); })
      .catch(e => {
        res.statusCode = 404;
        res.send({ errors: [e.message] });
      });
  });
};

module.exports = {
  init
};
