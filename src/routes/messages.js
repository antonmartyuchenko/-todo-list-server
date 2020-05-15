const messageService = require('../service');

module.exports.init = router => {
    router.get('/api/tasks', (req, res) => res.send(messageService.findAll()));

    router.get('/api/tasks/:id', (req, res) => {
        const { id } = req.params;

        if (id < 0) {
            res.statusCode = 400;
            return res.send({ errors: ['Enter message id'] });
        }

        try {
            return res.send(messageService.findOne(id));
        } catch (e) {
            res.statusCode = 404;
            return res.send({ errors: [e.message] });
        }
    });

    router.post('/api/tasks', (req, res) => {
        const { message } = req.body;

        if (!message) {
            res.statusCode = 400;
            return res.send({ errors: ['Enter message'] });
        }

        return res.send(messageService.addMessage(message));
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

        return res.send(messageService.updateMessage(id, message));
    });

    router.delete('/api/tasks/:id', (req, res) => {
        const { id } = req.params;

        if (!id || id < 0) {
            res.statusCode = 400;
            return res.send({ errors: ['Enter message id'] });
        }

        try {
            return res.send(messageService.deleteMessage(id));
        } catch (error) {
            res.statusCode = 404;
            return res.send({ errors: [error.message] });
        }
    });
}