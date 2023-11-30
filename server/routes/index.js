const express = require('express');
const { swaggerUi, specs } = require('../swagger');
const Router = express.Router();
const userRouter = require('./userRouter');
const waitMateRouter = require('./waitMateRouter');
const proxyRouter = require('./proxyRouter');
const reviewRouter = require('./reviewRouter');
const likeWaitRouter = require('./likeWaitRouter');
const paymentRouter = require('./paymentRouter');
const reservationRouter = require('./reservationRouter');

Router.get('', (req, res) => {
  res.send('hello world');
});

Router.use('/proxy', proxyRouter);
Router.use('/user', userRouter);
Router.use('/waitMate', waitMateRouter);
Router.use('/review', reviewRouter);
Router.use('/likeWait', likeWaitRouter);
Router.use('/payment', paymentRouter);
Router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
Router.use('/wmReservation', reservationRouter);

Router.use((req, res) => {
  res.status(404).send();
});

module.exports = Router;
