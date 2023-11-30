const jwt = require('jsonwebtoken');
const { User, Review, Proxy, WaitMate, LikeWait, ChatRoom } = require('../models');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

/**
 * 사용자 정보를 가져오는 함수.
 * @param {Object} req - Express의 요청 객체
 * @returns {Promise<Object>} - 사용자 정보 객체 (Promise 반환 하므로 await를 붙이기)
 * @throws {Error} - JWT 검증 오류 발생 시 빈 객체를 리턴합니다.
 * @example
 * const Common = require('../common');
 * const userInfo = await Common.cookieUserinfo(req);
 */
exports.cookieUserinfo = (req) => {
  return new Promise((resolve, reject) => {
    const access = req?.cookies?.access;
    if (!access) {
      return resolve({});
    };
    jwt.verify(access, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log(err);
        return resolve({})
      }
      const id = decoded?.id;
      const userInfo = await User.findOne({
        where : { id },
        attributes : ['id', 'userId', 'email', 'nickname', 'photo', 'createdAt', 'updatedAt'],
      })
      resolve(userInfo.dataValues)
    })
  })
};

const storage = (folderName) => {
  return multer.diskStorage({
    destination: async (req, file, cb) => {
      const filePath = path.join(__dirname, `../public/${folderName}`);
      try {
        await fs.promises.mkdir(filePath, {recursive : true});
        cb(null, filePath);
      } catch (err) {
        console.log(err);
        cb(err);
      }
    },
    filename: async (req, file, cb) => {
      try {
        const userInfo = await exports.cookieUserinfo(req);
        if (!userInfo) {
          return cb(new Error('쿠키값을 읽어올 수 없습니다.'))
        };
        console.log(userInfo);
        const extname = file.mimetype.split('/')[1];
        const userId = userInfo?.userId;
        const profileImgDir = path.join(__dirname, '../public/profileImg/');
        const files = await fs.promises.readdir(profileImgDir);
        const deletePromises = files.map((file) => {
          if (file.startsWith(`${userId}.`)) {
            return fs.promises.unlink(path.join(profileImgDir, file));
          }
        });
        await Promise.all(deletePromises);
        const photo = 'https://sesac-projects.site/wapi/public/profileImg/' + `${userId}.${extname}`;
        await User.update({photo}, {where :{userId}});
        cb(null, `${userId}.${extname}`);
      } catch (err) {
        console.log(err);
        cb(err);
      }
    }
  })
};

exports.upload = (folderName) => {
  return multer({ storage: storage(folderName) });
};
