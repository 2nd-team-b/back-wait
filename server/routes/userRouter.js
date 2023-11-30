const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const Common = require('../common');

userRouter.put('', userController.updateUserInfo);
userRouter.delete('', userController.deleteUser);
userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);
userRouter.get('/myinfo', userController.myInfo);
userRouter.get('/kakao', userController.kakaoResult);
userRouter.post('/check/nickname', userController.checkNickname);
userRouter.post('/check/userId', userController.checkUserId);
userRouter.post('/profileImg',Common.upload(`profileImg/`).single('profileImg'), userController.changeProfileImg);
userRouter.get('/logOut', userController.logOut);

userRouter.get('/:userId', userController.userInfo);

module.exports = userRouter;