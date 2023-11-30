const { LikeWait, WaitMate } = require('../models');

exports.getLikeWaitList = async (req, res) => {
  try {
    const { id } = req.query;
    let waitMateList = [];
    const gettingLikeWaitList = await LikeWait.findAll({
      where: {
        id,
      },
    });
    for (const element of gettingLikeWaitList) {
      const getWaitMate = await WaitMate.findOne({
        where: {
          wmId: element.wmId,
        },
      });
      if (getWaitMate) {
        waitMateList.push(getWaitMate);
      }
    }
    if (waitMateList) {
      res.send({ getLikeWaitList: waitMateList });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.postLikeWait = async (req, res) => {
  try {
    const { wmId, id } = req.body;
    if (typeof wmId !== 'undefined' && typeof id !== 'undefined') {
      const insertLikeWait = await LikeWait.create({
        id: id,
        wmId: wmId,
      });
      if (insertLikeWait) {
        res.send({ result: 'success' });
      } else {
        res.send({ result: 'fail' });
      }
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteLikeWait = async (req, res) => {
  try {
    const { wmId, id } = req.query;
    const deleteLikeWait = await LikeWait.destroy({
      where: {
        wmId: wmId,
        id: id,
      },
    });
    if (deleteLikeWait) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
