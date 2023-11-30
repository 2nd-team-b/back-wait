const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../controllers/paymentController');

paymentRouter.post('/kakao', paymentController.kakaoPay);
paymentRouter.get('/kakao/success', paymentController.success);
paymentRouter.get('/kakao/cancel', paymentController.cancel);
paymentRouter.get('/kakao/fail', paymentController.fail);


module.exports = paymentRouter

