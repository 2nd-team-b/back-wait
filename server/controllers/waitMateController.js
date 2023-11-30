const path = require('path'); //경로에 관한 내장 모듈
const { Op, fn, col } = require('sequelize');
const { WaitMate, ChatRoom, LikeWait, Proxy, ViewCount } = require('../models');

const checkDate = (waitTime, startTime, endTime) => {
  let checkDay = new Date();
  checkDay.setHours(9, 0, 0, 0);

  const newWaitTime = new Date(waitTime);

  if (newWaitTime < checkDay) {
    return false;
  } else if (startTime >= endTime) {
    return false;
  } else {
    return true;
  }
};

// waitMateDetail 조회
exports.getWaitMateDetail = async (req, res) => {
  // wmAddress를 요청에 받고 응답 값에는 id(user)를 보내 글쓴 주인인지 확인(waitMate에 포함됨)
  try {
    let isLikeWait = false;
    const { wmId, id } = req.query;
    // WaitMateDetail페이지
    const waitMate = await WaitMate.findOne({
      where: {
        wmId,
      },
    });

    // 조회수 증가
    waitMate.count += 1;
    const patchWaitMateCount = await WaitMate.update(
      {
        count: waitMate.count,
      },
      {
        where: {
          wmId: wmId,
        },
      }
    );

    if (id) {
      // 찜을 했는지 체크
      const likeWait = await LikeWait.findOne({
        where: {
          wmId: wmId,
          id: id,
        },
      });

      if (likeWait) {
        isLikeWait = true;
      }
    }
    //최근 채용 횟수(6개월전 ~ 현재)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentHiresCount = await WaitMate.findAll({
      attributes: [[fn('COUNT', col('*')), 'rowCount']],
      where: {
        id: waitMate.id,
        updatedAt: {
          [Op.between]: [sixMonthsAgo, new Date()],
        },
      },
      raw: true,
    }); // 실행 결과(예시): [ { rowCount: 8 } ]

    // 지원자수
    const waitMateApply = await ChatRoom.findAll({
      attributes: [[fn('COUNT', col('*')), 'rowCount']],
      where: {
        wmId: wmId,
      },
      raw: true,
    });

    res.send({
      waitMate: waitMate,
      recentHiresCount: recentHiresCount[0].rowCount,
      waitMateApplyCount: waitMateApply[0].rowCount,
      isLikeWait: isLikeWait,
    });
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate를 DB에 등록
exports.postWaitMate = async (req, res) => {
  try {
    let exchangePay;
    let exchangeDesc;
    const {
      id,
      title,
      wmAddress,
      wmDetailAddress,
      lng,
      lat,
      date,
      description,
      pay,
      startTime,
      endTime,
    } = req.body; //photo가 파일 자체가 날라옴
    let photo;
    if (!req.file) {
      photo = `/public/waitMateImg/waitMateDefaultImg.png`;
    } else {
      photo = `/public/waitMateImg/` + req.file.filename;
    }

    // waitTime, startTime, endTime 값이 제대로 들어왔는지 체크
    const check = checkDate(date, startTime, endTime);
    if (!check) {
      res.send({ result: 'validation failed' });
    } else {
      if (typeof pay === 'string') {
        exchangePay = null;
      } else {
        exchangePay = pay;
      }
      if (description === 'undefined') {
        exchangeDesc = null;
      } else {
        exchangeDesc = description;
      }
      // DB에 waitMate 등록
      const insertWaitMate = await WaitMate.create({
        id: id,
        title: title,
        wmAddress: wmAddress,
        wmDetailAddress: wmDetailAddress,
        lng: lng,
        lat: lat,
        waitTime: date,
        description: exchangeDesc,
        pay: exchangePay,
        startTime,
        endTime,
        photo: photo,
        state: 'active',
      });
      if (insertWaitMate) {
        res.send({ result: 'success' });
      } else {
        res.send({ result: 'fail' });
      }
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send({ result: 'Internal Server Error', error: e });
  }
};

// waitMate 삭제
exports.deleteWaitMate = async (req, res) => {
  try {
    const { wmId, id } = req.query;
    const deleteWaitMate = await WaitMate.destroy({
      where: {
        wmId: wmId,
        id: id,
      },
    });
    if (deleteWaitMate) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate 수정
exports.patchWaitMate = async (req, res) => {
  try {
    let exchangePay;
    let exchangeDesc;
    const {
      wmId,
      title,
      wmAddress,
      wmDetailAddress,
      lng,
      lat,
      date,
      description,
      pay,
      state,
      startTime,
      endTime,
    } = req.body;

    let isSuccess;

    // waitTime, startTime, endTime 값이 제대로 들어왔는지 체크
    const check = checkDate(date, startTime, endTime);
    if (!check) {
      res.send({ result: 'validation failed' });
    } else {
      if (typeof pay === 'string') {
        exchangePay = null;
      } else {
        exchangePay = pay;
      }
      if (description === 'undefined') {
        exchangeDesc = null;
      } else {
        exchangeDesc = description;
      }
      // 사진이 있으면
      if (req.file) {
        const patchWaitMate = await WaitMate.update(
          {
            title: title,
            wmAddress: wmAddress,
            waitTime: date,
            wmDetailAddress: wmDetailAddress,
            lng: lng,
            lat: lat,
            description: exchangeDesc,
            pay: exchangePay,
            photo: `/public/waitMateImg/` + req.file.filename,
            state: state,
            startTime,
            endTime,
          },
          {
            where: {
              wmId: wmId,
            },
          }
        );
        if (patchWaitMate) {
          isSuccess = true;
        }
      } else {
        // 사진이 없을때
        const patchWaitMate = await WaitMate.update(
          {
            title: title,
            wmAddress: wmAddress,
            wmDetailAddress: wmDetailAddress,
            lng: lng,
            lat: lat,
            waitTime: date,
            description: exchangeDesc,
            pay: exchangePay,
            state: state,
            startTime,
            endTime,
          },
          {
            where: {
              wmId: wmId,
            },
          }
        );
        if (patchWaitMate) {
          isSuccess = true;
        }
      }
      if (isSuccess) {
        res.send({ result: 'success' });
      } else {
        res.send({ result: 'fail' });
      }
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate 상태 변경
exports.patchWaitMateState = async (req, res) => {
  try {
    const { wmId, state } = req.query;
    const patchWaitMateState = await WaitMate.update(
      {
        state: state,
      },
      {
        where: {
          wmId: wmId,
        },
      }
    );
    if (patchWaitMateState) {
      res.send({ result: 'success' });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// waitMate목록 조회
exports.getWaitMateList = async (req, res) => {
  try {
    let { wmAddress, order } = req.query;

    let today = new Date();
    today.setHours(9, 0, 0, 0);

    // order가 정의되지 않은 경우 기본값으로 'updatedAt' 사용
    if (!order) {
      order = 'updatedAt';
    }
    if (wmAddress) {
      const waitMates = await WaitMate.findAll({
        where: {
          wmAddress: {
            [Op.like]: `%${wmAddress}%`,
          },
          state: {
            [Op.not]: `completed`, // state가 completed면 list에서 제외
          },
          waitTime: {
            [Op.gte]: today, // 현재 날짜이후만 가져오기
          },
        },
        order: [[order, 'DESC']],
      });
      res.send({
        waitMates: waitMates,
      });
    } else {
      const waitMates = await WaitMate.findAll({
        where: {
          waitTime: {
            [Op.gte]: today, // 현재 날짜이후만 가져오기
          },
        },
        order: [[order, 'DESC']],
      });
      res.send({
        waitMates: waitMates,
      });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.getWaitMateMapList = async (req, res) => {
  try {
    const getWaitMateMapList = await WaitMate.findAll({
      where: {
        state: {
          [Op.not]: `completed`, // state가 completed면 list에서 제외
        },
        // waitTime: {
        //   [Op.gte]: Date.now(), // 현재 날짜이후만 가져오기
        // },
      },
    });
    res.send(getWaitMateMapList);
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

exports.getMyWaitMate = async (req, res) => {
  try {
    const { id } = req.query;
    const myWaitMates = await WaitMate.findAll({
      where: {
        id,
      },
    });
    if (myWaitMates) {
      res.send({ myWaitMates: myWaitMates });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};

// 웨메 입장에서 거래완료한 waitMate 목록
exports.getMyWaitMateList = async (req, res) => {
  try {
    const { id } = req.query;
    const completedMyWaitMateList = await WaitMate.findAll({
      where: {
        id: id,
        state: 'completed',
      },
    });
    if (completedMyWaitMateList) {
      res.send({ completedMyWaitMateList: completedMyWaitMateList });
    } else {
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.error('Error WaitMate data:', e);
    res.status(500).send('Internal Server Error');
  }
};
