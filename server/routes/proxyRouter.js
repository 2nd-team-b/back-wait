const express = require('express');
const multer = require('multer');
const proxyRouter = express.Router();
const proxyController = require('../controllers/proxyController');
const path = require('path');
const chatController = require('../controllers/chatController');

// Multer를 위한 저장 엔진을 생성합니다.
const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, 'public/proxyImg/');
  },
  filename(req, file, done) {
    const ext = path.extname(file.originalname);
    done(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

// 저장 엔진을 사용하여 Multer를 초기화합니다.
const uploadProxy = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//프록시 글 등록
proxyRouter.post(
  '/register',
  uploadProxy.single('photo'),
  proxyController.input.postRegister
);
//프록시 글 등록 테스트
proxyRouter.post(
  '/proxyTest',
  uploadProxy.single('photo'),
  proxyController.input.postRegisterTest
);
//프록시 글 리스트 뽑아오기
proxyRouter.get('/list', proxyController.output.getProxyAll);
//프록시 특정 글 보기
proxyRouter.get('/detail/:proxyId', proxyController.output.getProxyOne);
//웨이트메이트가 지정한 동까지의 프록시 불러오기
proxyRouter.get('/realGetter', proxyController.output.getAddressAll);
// /createRoom 엔드포인트에 컨트롤러 함수를 할당
proxyRouter.post('/createRoom', chatController.createRoom);

//등록된 채팅방 정보들을 불러옴
proxyRouter.get('/listChatting', proxyController.output.getChattingList);

// 모든 채팅 리스트 뽑기
proxyRouter.get(
  '/listChatting2',
  proxyController.output.getChattingListWithLatest
);

//등록된 프록시를 변경
proxyRouter.patch(
  '/update/:id',
  uploadProxy.single('photo'),
  proxyController.input.updateProxy
);
//등록된 프록시를 삭제
proxyRouter.delete('/delete/:id', proxyController.input.deleteRegister);
// 프록시 이미지 등록
proxyRouter.post(
  '/imgUpload',
  uploadProxy.single('photo'),
  proxyController.input.postImgProxy
);

//채팅 데이터 가져오기
proxyRouter.get('/chat/:roomNumber', proxyController.output.getChatData);
// 웨이트메이트 값 가져오기
proxyRouter.get('/userList', proxyController.output.getWaitMateList);
//채팅 데이터 하나만 가져오기(채팅리스트 이유)
proxyRouter.get(
  '/chatListOne/:roomNumber',
  proxyController.output.getChatDetailOne
);
//등록된 프록시들의 모든 정보값 불러오기
proxyRouter.get('/getProxyAll', proxyController.output.getProxyList);
// 프록시 업데이트
proxyRouter.patch('/update2/:proxyId', uploadProxy.single('photo'), proxyController.input.realUpdateProxyId);
// 프록시 업로드시 글 가져오기
proxyRouter.get('/updateGet/:proxyId', proxyController.output.getProxyOne);

//몽구스 테스트
proxyRouter.post('/mongoose', proxyController.input.mongooseTest);
module.exports = proxyRouter;
