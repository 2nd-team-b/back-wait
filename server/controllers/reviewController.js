const { User, Review } = require('../models');
const Common = require('../common');

exports.createReview = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '로그인을 먼저 진행해 주세요' });
      return;
    }
    let { score, id } = req.body;
    score = Number(score);
    id = Number(id);
    const user = await User.findOne({
      where: { id },
      attributes: ['userId', 'score'],
    });
    if (!score) {
      res.status(400).json({ message: '점수가 존재하지 않습니다.' });
      return;
    }
    if (score > 5 || score < 0) {
      res.status(400).json({ message: '유효하지 않은 점수입니다.' });
      return;
    }
    if (!user) {
      res.status(400).json({ message: '리뷰의 대상이 정해져 있지 않습니다.' });
      return;
    }
    const reviewData = { id, score };
    const review = await Review.create({
      ...reviewData,
      writerId: userInfo.id,
    });
    if (review) {
      const { count, _ } = await Review.findAndCountAll({
        where: { id },
      });
      const oldScore = user.dataValues.score;
      await User.update(
        {
          score: (oldScore * (count - 1) + score) / count,
        },
        {
          where: { id },
        }
      );
      res.status(201).json({ message: '리뷰가 정상적으로 생성되었습니다.' });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
exports.getReview = async (req, res) => {
  try {
    const reviewId = req?.params?.reviewId;
    if (!reviewId) {
      res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
      return;
    }
    const review = await Review.findOne({
      where: { reviewId },
    });
    res.status(200).json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
exports.updateReview = async (req, res) => {
  try {
    const reviewId = Number(req.params?.reviewId);
    const review = await Review.findOne({ where: { reviewId } });
    if (!review) {
      res.status(404).json({ message: '존재하지 않는 리뷰입니다.' });
    }
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '로그인을 먼저 진행해 주세요' });
      return;
    }
    let newScore = req.body?.score;
    newScore = Number(newScore);
    if (newScore > 5 || newScore < 0 || isNaN(newScore)) {
      res.status(400).json({ message: '리뷰 점수값이 올바르지 않습니다.' });
      return;
    }
    const oldScore = review?.dataValues?.score;
    const id = review?.dataValues?.id;
    if (!newScore) {
      res.status(400).json({ message: '바꾸려는 점수가 입력되지 않았습니다.' });
      return;
    }
    if (review.dataValues.writerId !== String(userInfo.id)) {
      res.status(403).json({ message: '오직 작성자만 리뷰 수정이 가능합니다' });
      return;
    }
    const response = await Review.update(
      {
        score: newScore,
      },
      {
        where: { reviewId: reviewId },
      }
    );
    if (response) {
      const user = await User.findOne({
        where: { id: review.dataValues.id },
      });
      const { count, _ } = await Review.findAndCountAll({
        where: { id },
      });
      const oldUserScore = user?.dataValues?.score;
      const userNewScore = (oldUserScore * count - oldScore + newScore) / count;
      await User.update(
        {
          score: userNewScore,
        },
        {
          where: { id },
        }
      )
        .then(() => {
          res.status(201).json({ message: '리뷰 수정이 완료되었습니다.' });
        })
        .catch((err) => {
          console.error(err);
          throw new Error();
        });
    } else {
      throw new Error();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params?.reviewId);
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '로그인을 먼저 진행해 주세요' });
      return;
    }
    const review = await Review.findOne({ where: { reviewId } });
    if (!review) {
      res.status(404).json({ message: '리뷰가 존재하지 않습니다.' });
      return;
    }
    if (String(userInfo.id) !== review.dataValues.writerId) {
      res
        .status(403)
        .json({ message: '오직 작성자만 리뷰를 삭제할 수 있습니다.' });
      return;
    }
    const user = await User.findOne({
      where: { id: review.dataValues.id },
    });
    const { count, _ } = await Review.findAndCountAll({
      where: { id: review.dataValues.id },
    });
    const oldScore = review.dataValues.score;
    const oldUserScore = user?.dataValues?.score;
    const userNewScore = (oldUserScore * count - oldScore) / (count - 1);
    await User.update(
      {
        score: userNewScore,
      },
      {
        where: { id: review.dataValues.id },
      }
    );
    await Review.destroy({
      where: { reviewId },
    })
      .then(() => {
        res.status(204).json({ message: '정상적으로 삭제가 완료되었습니다.' });
      })
      .catch(() => {
        throw new Error();
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};

exports.checkReview = async (req, res) => {
  try {
    const { userId, id } = req.query;
    const checkingReview = await Review.findOne({
      where: {
        id: id,
        writerId: userId,
      },
    });
    if (checkingReview) {
      res.send({ result: false });
    } else {
      const findNickname = await User.findOne({
        where: {
          id: id,
        },
      });
      res.send({ result: true, User: findNickname });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
