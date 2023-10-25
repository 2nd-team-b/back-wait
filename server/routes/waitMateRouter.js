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
 *   get:
 *     summary: 웨이트메이트(글)목록 불러오기
 *     tags: [WaitMate]
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: 'Hello, Swagger!'
 */
waitMateRouter.get('/', waitMateController.getWaitMate);

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
 *               result: "success"
 */
waitMateRouter.post('/', waitMateController.postWaitMate);

module.exports = waitMateRouter;
