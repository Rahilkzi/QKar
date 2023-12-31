const express = require('express');
const router = express.Router();
const controller = require('./controllers');
const app = require('./app');
const middleware = require('./middleware');

router.use('/admin', middleware.protectEndpoint);

router.get('/', controller.create);
router.get('/create', controller.create);
router.post('/submit', controller.submit);
router.get('/qr/:vahicalid', controller.generateQR);
router.get('/find/:hash', controller.findUser);
router.get('/test/:id', controller.Test);

router.get('/users', app.GetUsers);
router.post('/insert', app.Insert);
router.get('/delete/:id', app.DeleteByID);
router.get('/trunk', app.Trunk);
router.get('/get/:type/:Param', app.GetInfo);

module.exports = router;
