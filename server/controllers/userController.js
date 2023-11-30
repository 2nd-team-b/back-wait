const { User, Review, Proxy, WaitMate } = require('../models');
const Common = require('../common');
const bcryptjs = require('bcryptjs');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const validReg = {
  userId: /^[A-Za-z0-9]{4,12}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  nickname: /^.{2,10}$/,
};
const isValidate = (item, check) => {
  return check.test(item);
};
const inValidSignup = async (columnName, value) => {
  if (!value) {
    return `${columnName}값이 존재하지 않습니다.`;
  }
  if (!isValidate(value, validReg[columnName])) {
    return `올바르지 않은 ${columnName}값입니다.`;
  }
  if (columnName === 'password') {
    return false;
  }
  const condition = {};
  condition[columnName] = value;
  const response = await User.findOne({
    where: condition,
  });
  return response ? `${columnName}값이 이미 존재합니다.` : false;
};
exports.register = async (req, res) => {
  try {
    const user = await Common.cookieUserinfo(req);
    if (!user) {
      res.status(401).json({ message: '이미 로그인된 유저입니다.' });
      return;
    }
    const { userId, password, nickname } = req.body;
    const userInfo = { userId, password, nickname };
    const errMessages = [];
    await Promise.all(
      Object.entries(userInfo).map(async ([k, v]) => {
        const response = await inValidSignup(k, v);
        if (response) {
          errMessages.push(response);
        }
      })
    );
    if (errMessages.length > 0) {
      console.error(errMessages);
      res.status(400).json({ errors: errMessages });
    } else {
      if (await User.findOne({ where: { userId: userId } })) {
        res.status(400).json({ message: '이미 존재하는 userId입니다.' });
        return;
      }
      if (await User.findOne({ where: { nickname: nickname } })) {
        res.status(400).json({ message: '이미 존재하는 nickname입니다.' });
        return;
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      await User.create({
        userId,
        password: hashedPassword,
        nickname,
      });
      res.status(201).json({ message: '회원 가입 완료' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '이미 로그인된 유저입니다.' });
      return;
    }
    const { userId, password } = req.body;
    let user = await User.findOne({
      where: { userId: userId },
    });
    user = user?.dataValues;
    if (!user) {
      res.status(401).json({ message: '회원가입되지 않은 유저입니다.' });
      return;
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: '올바르지 않은 비밀번호 입니다.' });
    } else {
      const userInfo = {};
      userInfo['userId'] = user.userId;
      userInfo['id'] = user.id;
      const token = jwt.sign(userInfo, process.env.SECRET_KEY);
      res.cookie('access', token, {
        maxAge: 24 * 60 * 60 * 1000,
        Path: '/',
        httpOnly: true,
      });
      res.status(200).json({ user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.myInfo = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '로그인을 먼저 해주세요' });
    } else {
      res.json(userInfo);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.userInfo = async (req, res) => {
  try {
    const id = req.params?.userId;
    const response = await User.findOne({
      where: { id },
      attributes: [
        'userId',
        'email',
        'nickname',
        'photo',
        'createdAt',
        'updatedAt',
      ],
      include: [{ model: Review }, { model: Proxy }, { model: WaitMate }],
    });
    if (!response) {
      res.status(404).json({ message: '존재하지 않는 사용자 입니다.' });
    } else {
      res.send(response);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.updateUserInfo = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (Object.keys(userInfo).length === 0) {
      res.status(401).json({ message: '로그인을 먼저 해주세요' });
      return;
    }
    if (req.body.userId) {
      res.status(403).json({ message: '아이디는 변경할 수 없습니다.' });
      return;
    }
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }
    for (const [k, v] of Object.entries(req.body)) {
      if (k !== 'userId') {
        userInfo[k] = v;
      }
    }
    if (req.file?.filename) {
      userInfo[
        'photo'
      ] = `https://sesac-projects.site/wapi/public/profileImg/${req.file?.filename}`;
    }
    const response = await User.update(userInfo, {
      where: { id: userInfo.id },
    });
    if (response) {
      res.status(201).json({ message: '업데이트가 완료되었습니다.' });
    } else {
      res.status(400).json({
        message: '이미 존재하는 값이거나 존재하지 않는 필드이름 입니다.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(401).json({ message: '로그인을 먼저 해주세요' });
    } else {
      await User.destroy({
        where: { id: userInfo.id },
      })
        .then((_) => {
          res.status(204).send();
        })
        .catch((err) => {
          console.log(err);
          res
            .status(403)
            .json({ message: '훼손된 토큰입니다. 다시 로그인 해주세요' });
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러 입니다.' });
  }
};
exports.kakaoResult = async (req, res) => {
  try {
    const code = req.query?.code;
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: `${process.env.KAKAO_REST_API_KEY}`,
        redirect_uri: 'https://sesac-projects.site/wapi/user/kakao',
        code: `${code}`,
      },
      {
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
    if (response.status !== 200) {
      throw new Error('카카오 서버 에러');
    }
    const {
      access_token,
      token_type,
      refresh_token,
      expires_in,
      refresh_token_expires_in,
    } = response.data;
    const info = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `${token_type} ${access_token}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    if (info.status !== 200) {
      throw new Error('카카오 서버 에러');
    }
    const kakaoId = info?.data?.id;
    const kakaoProperties = info?.data?.properties;
    let kakaoUser = await User.findOne({
      where: { userId: kakaoId, social: 'kakao' },
    });
    if (!kakaoUser) {
      kakaoUser = await User.create({
        userId: kakaoId,
        nickname: `${kakaoProperties.nickname}`,
        email: `${kakaoId}@kakao.com`,
        social: 'kakao',
      });
    }
    const userInfo = {};
    userInfo['id'] = kakaoUser?.id;
    userInfo['nickname'] = kakaoUser?.nickname;
    const token = jwt.sign(userInfo, process.env.SECRET_KEY);
    res.cookie('access', token, {
      maxAge: 24 * 60 * 60 * 1000,
      Path: '/',
      httpOnly: true,
    });
    res.send(`
    <html>
      <body>
        <h1 
          style="
            position:absolute; 
            top:50%; 
            left:50%; 
            transform:translate(-50%,-50%)
            ">
          로그인 중...</h1>
        <script>
          const reload = () => {
            return setTimeout(() => {window.location.href='https://sesac-projects.site/waitmate/map'}, 1000)
          }
          reload();
        </script>
      </body>
    </html>
  `);
  } catch (err) {
    console.error(err);
  }
};
exports.checkUserId = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findOne({ where: { userId } });
    if (user) {
      res.status(400).json({ message: '이미 존재하는 userId입니다.' });
      return;
    }
    res.status(200).json({ message: '사용가능한 userId입니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
exports.checkNickname = async (req, res) => {
  try {
    const { nickname } = req.body;
    const user = await User.findOne({ where: { nickname } });
    if (user) {
      res.status(400).json({ message: '이미 존재하는 nickname입니다.' });
      return;
    }
    res.status(200).json({ message: '사용가능한 nickname입니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
exports.logOut = (req, res) => {
  try {
    res.clearCookie('access');
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500);
  }
};
exports.changeProfileImg = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    if (!userInfo) {
      res.status(400).send();
      return;
    }
    res.status(201).json({
      message: '정상적으로 프로필 이미지가 변경되었습니다.',
      imageUrl: userInfo.photo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '알 수 없는 서버 에러' });
  }
};
