const express = require('express');
const router = express.Router();
const controller = require('./controllers');
const app = require('./app');

router.get('/', controller.create);
router.get('/create', controller.create);
router.get('/qr/:vahicalid', controller.generateQR);
router.get('/find/:id', controller.findUser);
router.get('/test/:id', controller.Test);

router.get('/users', app.GetUsers);
router.post('/insert', app.Insert);
router.get('/delete/:id', app.DeleteByID);
router.get('/trunk', app.Trunk);
router.get('/get/:type/:id', app.GetInfo);

module.exports = router;
