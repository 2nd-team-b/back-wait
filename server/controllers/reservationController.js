const { WaitMate, Proxy, Reservations } = require('../models');

exports.getWaitMateReservation = async (req, res) => {
  try {
    const { wmId } = req.query;
    const getReservation = await WaitMate.findOne({
      where: {
        wmId,
      },
    });
    if (getReservation) {
      res.send({ result: 'success', getReservation });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// 내가 픽한 웨이트메이트
exports.getPickedWaitMate = async (req, res) => {
  try {
    const { id } = req.query;
    let waitMateList = [];
    const getProxyId = await Proxy.findOne({
      where: {
        id,
      },
    });
    if (getProxyId) {
      const getPickedWaitMate = await Reservations.findAll({
        where: {
          proxyId: getProxyId.proxyId,
        },
      });
      for (const element of getPickedWaitMate) {
        const waitMate = await WaitMate.findOne({
          where: {
            wmId: element.wmId,
          },
        });
        waitMateList.push(waitMate);
      }
      if (getPickedWaitMate) {
        res.send({ waitMateList: waitMateList });
      } else {
        res.send({ result: 'fail' });
      }
    } else {
      res.send({ result: 'no proxy' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// 내가 픽한 프록시
exports.getPickedProxy = async (req, res) => {
  try {
    const { id } = req.query;

    let proxyList = [];
    const getWMId = await WaitMate.findAll({
      where: {
        id,
      },
    });
    for (const element of getWMId) {
      const getPickedProxy = await Reservations.findOne({
        where: {
          wmId: element.wmId,
        },
      });
      if (getPickedProxy) {
        const proxy = await Proxy.findOne({
          where: {
            proxyId: getPickedProxy.proxyId,
          },
        });
        proxyList.push(proxy);
      }
    }
    // 중복된 프록시 제거
    const uniqueArray = proxyList.filter(
      (element, index, self) =>
        index === self.findIndex((e) => e.proxyId === element.proxyId)
    );

    if (uniqueArray[0] !== '') {
      res.send({ proxyList: uniqueArray });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.postReservation = async (req, res) => {
  try {
    const { wmId, proxyId } = req.body;

    if (typeof wmId !== 'undefined' && typeof proxyId !== 'undefined') {
      const newReservation = await Reservations.create({
        wmId: wmId,
        proxyId: proxyId,
      });
      if (newReservation) {
        res.send({ result: 'success' });
      } else {
        res.send({ result: 'fail' });
      }
    } else {
      res.send({ wmId: wmId, proxyId: proxyId });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
