'use strict';

const multer = require('multer');
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});
// const createError = require('http-errors');

const bearerAuth = require('../lib/bearer-auth-middleware');
const picCtrl = require('../controller/pic-controller');


module.exports = function(router){

  router.post('/gallery/:id/pic', bearerAuth, upload.single('image'), (req, res)=>{
    picCtrl.createItem(req)
    .then(pic=>res.json(pic))
    .catch(err=>console.error(err));
  });

  router.delete('/gallery/:galleryId/pic/:picId', bearerAuth, (req, res) => {
    picCtrl.deleteItem(req.params.galleryId, req.params.picId)
    .then(err => res.status(204).send(err.message))
    .catch(err => res.status(err.status).send(err.message));
  });
  return router;
};
