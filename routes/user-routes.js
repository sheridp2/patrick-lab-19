
'use strict';

const basicAuth = require('../lib/basic-auth-middleware');
const authController = require('../controller/user-controller');

module.exports = function(router) {
  router.post('/signup', (req, res) => {
    authController.createItem(req, res)
    .then(token => res.json(token))
    .catch( err => res.status(err.status).send(err));

  });

  router.get('/signin', basicAuth, (req, res) => {
    authController.fetchItem(req)
    .then(token => res.json(token))
    .catch( err => res.status(err.status).send(err));
  });
  return router;
};
