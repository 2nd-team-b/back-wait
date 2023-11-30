const { Proxy, WaitMate, User } = require('../models');
const Room = require('../schema/Room');
const ChatData = require('../schema/ChatData');
const Common = require('../common');

const { Op } = require('sequelize');

const input = {
  //프록시 테스트용
  postRegisterTest: async (req, res) => {
    try {
      if (req.body.photo === null) {
        const postProxy = await Proxy.create({
          id: req.body.id,
          title: req.body.title,
          proxyAddress: req.body.proxyAddress,
          gender: req.body.gender,
          age: req.body.age,
          proxyMsg: req.body.proxyMsg,
          photo: `${process.env.AWS_HOST}/public/proxyImg/default.png`,
        });
        return res.send(postProxy);
      } else if (req.body.photo !== null) {
        const postProxy = await Proxy.create({
          id: req.body.id,
          title: req.body.title,
          proxyAddress: req.body.proxyAddress,
          gender: req.body.gender,
          age: req.body.age,
          proxyMsg: req.body.proxyMsg,
          photo: `${process.env.AWS_HOST}/public/proxyImg/` + req.file.filename,
        });
        return res.send(postProxy);
      }
    } catch (err) {
      console.error(err);
    }
  },

  // 프록시가 자신의 정보를 등록하는 코드
  postRegister: async (req, res) => {
    //프록시 생성시에 등록될 정보들
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 먼저 해주세요' });
      } else {
        // 프록시 조회
        const selectAll = await Proxy.findAll();
        const idArray = selectAll.map((item) => item.id);

        // 이미 등록된 글이 있는지 확인
        if (idArray.includes(userInfo.id)) {
          res.status(402).json({ message: '이미 등록하신 글이 있습니다' });
        } else {
          // 등록 가능한 경우 프록시 생성
          if (!req.file) {
            const postProxy = await Proxy.create({
              id: req.body.id,
              proxyAddress: req.body.proxyAddress,
              gender: req.body.gender,
              age: req.body.age,
              proxyMsg: req.body.proxyMsg,
              title: req.body.title,
              photo: `https://sesac-projects.site/waitmate/images/proxy.png`,
            });
            return res.send(postProxy);
          } else if (req.file) {
            const postProxy = await Proxy.create({
              id: req.body.id,
              proxyAddress: req.body.proxyAddress,
              gender: req.body.gender,
              age: req.body.age,
              proxyMsg: req.body.proxyMsg,
              title: req.body.title,
              photo:
                `${process.env.AWS_HOST}/public/proxyImg/` + req.file.filename,
            });
            return res.send(postProxy);
          }
        }
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
    }
  },

  // 등록한 프록시 정보를 업데이트 하는 코드
  // updateProxy: async (req, res) => {
  //   try {
  //     const userInfo = Common.cookieUserinfo(req);
  //     if (!userInfo) {
  //       res.status(401).json({ message: '로그인을 먼저 해주세요' });
  //     } else {
  //       const updateProxy = await Proxy.update(
  //         {
  //           id: req.body.id,
  //           proxyAddress: req.body.proxyAddress,
  //           gender: req.body.gender,
  //           age: req.body.age,
  //           proxyMsg: req.body.proxyMsg,
  //           title: req.body.title,
  //           photo: 'http://localhost:8080/public/proxyImg/' + req.file.filename,
  //         },
  //         {
  //           where: { id: userInfo.id },
  //         }
  //       );
  //       return res.send(updateProxy);
  //     }
  //   } catch (err) {
  //     console.error(e);
  //     res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  //   }
  // },

  // 등록한 프록시 정보를 업데이트 하는 코드
  updateProxy: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 먼저 해주세요' });
      } else {
        const updateProxy = await Proxy.update(
          {
            id: req.body.id,
            proxyAddress: req.body.proxyAddress,
            gender: req.body.gender,
            age: req.body.age,
            proxyMsg: req.body.proxyMsg,
            title: req.body.title,
            photo:
              `${process.env.AWS_HOST}/public/proxyImg/` + req.file.filename,
          },
          {
            where: { id: userInfo.id },
          }
        );
        return res.send(updateProxy);
      }
    } catch (err) {
      console.error(e);
      res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
    }
  },

  //진짜로 업데이트 코드
  realUpdateProxyId: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 진행하십시오' });
      } else {
        if (!req.file) {
          const updateProxy = await Proxy.update(
            {
              proxyAddress: req.body.proxyAddress,
              gender: req.body.gender,
              age: req.body.age,
              proxyMsg: req.body.proxyMsg,
              title: req.body.title,
            },
            {
              where: { proxyId: parseInt(req.params.proxyId) },
            }
          );
          const updatedRows = updateProxy[0];

          if (updatedRows > 0) {
            return res.send({
              message: '프록시가 성공적으로 업데이트되었습니다.',
            });
          } else {
            return res.send({
              message: '해당하는 프록시가 없거나 업데이트되지 않았습니다.',
            });
          }
        } else if (req.file) {
          const updateProxy = await Proxy.update(
            {
              proxyAddress: req.body.proxyAddress,
              gender: req.body.gender,
              age: req.body.age,
              proxyMsg: req.body.proxyMsg,
              title: req.body.title,
              photo:
                `https://sesac-projects.site/waitmate/public/proxyImg/` +
                req.file.filename,
            },
            {
              where: { proxyId: parseInt(req.params.proxyId) },
            }
          );
          const updatedRows = updateProxy[0];

          if (updatedRows > 0) {
            return res.send({
              message: '프록시가 성공적으로 업데이트되었습니다.',
            });
          } else {
            return res.send({
              message: '해당하는 프록시가 없거나 업데이트되지 않았습니다.',
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '알 수 없는 서버 오류입니다!' });
    }
  },

  // 등록한 프록시를 삭제하는 코드
  deleteRegister: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 먼저 시도하십시오' });
      } else {
        const deleteProxy = await Proxy.destroy({
          where: { id: userInfo.id },
        });
        res.send({ message: deleteProxy });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '알 수 없는 서버 에러입니다.' });
    }
  },

  // 프록시 사진 등록하는 방법
  postImgProxy: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 먼저 진행해 주세요' });
      } else {
        const proxyInfo = await Proxy.findOne({
          where: { id: { id: userInfo.id } },
        });

        if (proxyInfo.photo === 'null') {
          await Proxy.update(
            {
              photo: '/public/proxyImg/default.jpg',
            },
            {
              where: { id: { id: userInfo.id } },
            }
          );
        } else {
          await Proxy.update(
            {
              photo: '/public/proxyImg/' + req.file.filename,
            },
            {
              where: { id: { id: userInfo.id } },
            }
          );
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '알 수 없는 서버 에러입니다.' });
    }
  },

  mongooseTest: async (req, res) => {
    try {
      const newRoom = new Room({
        wmId: req.body.wmId,
        proxyId: req.body.proxyId,
      });

      const room = await newRoom.save(); // 비동기로 저장하고 결과를 받음

      res.status(201).json(room); // 성공 응답 보내기
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '방 생성 실패' }); // 오류 응답 보내기
    }
  },
};

const output = {
  // proxy 정보들을 확인하는 방법
  getProxyAll: async (req, res) => {
    try {
      const { address, order } = req.query;
      if (address) {
        //주소가 있을때
        if (order === 'star') {
          const proxyAddress = await Proxy.findAll({
            where: {
              proxyAddress: {
                [Op.like]: `%${address}%`,
              },
            },
            include: [
              {
                model: User,
                required: true,
                attributes: ['score'],
              },
            ],
          });

          res.send({ list: proxyAddress });
        } else if (order === 'updatedAt') {
          const proxyAddress = await Proxy.findAll({
            where: {
              proxyAddress: {
                [Op.like]: `%${address}%`,
              },
            },
            order: [[order, 'DESC']],
          });

          res.send({ list: proxyAddress });
        }
      } else {
        //주소가 없을때
        if (order === 'star') {
          const proxyAddress = await Proxy.findAll({
            include: [
              {
                model: User,
                required: true,
                attributes: ['score'],
              },
            ],
          });

          res.send({ list: proxyAddress });
        } else if (order === 'updatedAt') {
          const proxyAddress = await Proxy.findAll({
            order: [[order, 'DESC']],
          });

          res.send({ list: proxyAddress });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '정보값들을 불러오지 못했습니다.' });
    }
  },

  // 특정한 구의 정보값들을 불러오는 방법
  getAddressAll: async (req, res) => {
    try {
      const userInfo = Common.cookieUserinfo(req);
      if (!userInfo) {
        res.status(401).json({ message: '로그인을 먼저 진행해 주세요' });
      } else {
        const { address, order } = req.query;
        if (address) {
          // 주소가 요청에 있을때
          const proxyList = await Proxy.findAll({
            where: {
              proxyAddress: {
                [Op.like]: `%${address}%`,
              },
            },
            order: [[order, 'DESC']],
          });
          if (proxyList) {
            res.send({ list: proxyList });
          } else {
            res.send({ message: '정보들을 불러오지 못했습니다.' });
          }
        } else {
          //주소가 요청에 없을때
          const proxyList = await Proxy.findAll({ order: [[order, 'DESC']] });
          if (proxyList) {
            res.send({ list: proxyList });
          } else {
            res.send({ message: '정보들을 불러오지 못했습니다.' });
          }
        }
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '정보값들을 불러오지 못했습니다.' });
    }
  },

  // proxy 하나의 정보를 가져오는 값
  getProxyOne: async (req, res) => {
    const proxy = await Proxy.findOne({
      where: { proxyId: req.params.proxyId },
    });

    return res.send({ result: proxy });
  },

  // 자신의 채팅방 목록을 가져오는 코드
  getChattingList: async (req, res) => {
    try {
      const userInfo = await Common.cookieUserinfo(req);

      if (userInfo) {
        const resultList = await Room.find({
          $or: [{ sender: userInfo.id }, { receiver: userInfo.id }],
        });
        // 정보가 있는 경우
        if (resultList && resultList.length > 0) {
          res.send({ list: resultList });
        } else {
          // 정보가 없는 경우
          res.send({ message: '채팅방 목록이 없습니다.' });
        }
      } else {
        // userInfo가 없는 경우
        res.send({ message: '사용자 정보를 찾을 수 없습니다.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: '서버 오류 발생' });
    }
  },

  // 모든 채팅 리스트 출력
  getChatData: async (req, res) => {
    try {
      const result = await ChatData.find({
        roomNumber: req.params.roomNumber,
      });

      res.send({ list: result });
    } catch (err) {
      console.error(err);
    }
  },

  //모든 웨이트 메이트 리스트값 적용

  getWaitMateList: async (req, res) => {
    try {
      const result = await WaitMate.findAll({
        where: { id: req.query.id },
      });

      res.send(result);
    } catch (err) {
      console.error(err);
    }
  },

  // 채팅창에서 딱 하나의 정보값만 가져오는 것 적용
  getChatDetailOne: async (req, res) => {
    try {
      const { roomNumber } = req.params; // 채팅 방번호는 라우트 파라미터로 받아온다고 가정

      // 해당 방번호의 최신 정보글 가져오기
      const result = await ChatData.findOne({ roomNumber })
        .sort({ createdAt: -1 })
        .limit(1);
      if (!result) {
        return res
          .status(404)
          .json({ message: '해당 방번호의 채팅이 없습니다.' });
      }

      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '서버 오류입니다.' });
    }
  },

  // 모든 채팅 리스트들 뽑기
  getChattingListWithLatest: async (req, res) => {
    try {
      if (!req.query.id) {
        res.send({ list: '채팅 리스트가 존재하지 않습니다' });
      }

      const roomList = await Room.find({
        $or: [{ sender: req.query.id }, { receiver: req.query.id }],
      });

      if (!roomList || roomList.length === 0) {
        return res.send({ message: '채팅방 목록이 없습니다.' });
      }

      const chatListWithLatest = [];

      for (const room of roomList) {
        const latestChat = await ChatData.findOne({
          roomNumber: room.roomNumber,
        })
          .sort({ createdAt: -1 })
          .limit(1);

        const latestChatWithNumericSenderReceiver = {
          roomNumber: room.roomNumber,
          sender: latestChat ? latestChat.sender : null,
          receiver: latestChat ? latestChat.receiver : null,
          latestChat: latestChat || null,
        };

        chatListWithLatest.push(latestChatWithNumericSenderReceiver);
      }

      res.send({ list: chatListWithLatest });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: '서버 오류 발생' });
    }
  },

  //모든 프록시 리스트들
  getProxyList: async (req, res) => {
    try {
      const result = await Proxy.findAll({
        where: {
          id: req.query.id,
        },
      });
      res.send(result);
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = { input, output };
