const express = require('express');
const reviewRouter = express.Router();
const reviewController = require('../controllers/reviewController');

reviewRouter.post('', reviewController.createReview);
reviewRouter.get('/check', reviewController.checkReview);
reviewRouter.get('/:reviewId', reviewController.getReview);
reviewRouter.put('/:reviewId', reviewController.updateReview);
reviewRouter.delete('/:reviewId', reviewController.deleteReview);

module.exports = reviewRouter;
