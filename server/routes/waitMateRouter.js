const express = require('express');
const waitMateRouter = express.Router();
const waitMateController = require('../controllers/waitMateController');

// routes/sampleRoute.js
/**
 * @swagger
 * tags:
 *   name: WaitMate
 *   description: 웨이트메이트 관련 API
 */

/**
 * @swagger
 * /waitMate:
 *   post:
 *     summary: 웨이트메이트(글) 등록
 *     tags: [WaitMate]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'Hello, Swagger!'
 */
waitMateRouter.post('/register', waitMateController.postRegister);

module.exports = waitMateRouter;
