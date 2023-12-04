const express = require('express');
const router = express.Router();
const controller = require('./controllers');
const app = require('./app');


router.get('/', controller.create);
router.get('/create', controller.create);
router.get('/qr/:vahicalid', controller.generateQR);
router.get('/find/:id', controller.findUser);

router.get('/users', app.GetUsers);
router.get('/insert', app.Insert);
router.get('/getbyID/:id', app.GetByID);
router.get('/getbyVNo/:vahicalNO', app.GetByVno);

router.get('/delete/:id', app.DeleteByID);
router.get('/trunk', app.Trunk);






module.exports = router;
