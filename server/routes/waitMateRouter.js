const express = require('express');
const waitMateRouter = express.Router();
const waitMateController = require('../controllers/waitMateController');
const Common = require('../common');
// 멀터 설정
const multer = require('multer');
const path = require('path'); //경로에 관한 내장 모듈

//업로드 코드
const uploadWaitMate = multer({
  storage: multer.diskStorage({
    destination(req, res, done) {
      done(null, 'public/waitMateImg');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// waitMate 조회
waitMateRouter.get('/detail', waitMateController.getWaitMateDetail);
// waitMate(글) 등록
waitMateRouter.post(
  '/register',
  uploadWaitMate.single('waitMateImg'),
  waitMateController.postWaitMate
);
// waitMate 삭제
waitMateRouter.delete('/', waitMateController.deleteWaitMate);
// waitMate 수정
waitMateRouter.patch(
  '/',
  uploadWaitMate.single('waitMateImg'),
  waitMateController.patchWaitMate
);

// waitMate 목록 조회
waitMateRouter.get('/list', waitMateController.getWaitMateList);

// waitMate 전체 조회
waitMateRouter.get('/mapList', waitMateController.getWaitMateMapList);

module.exports = waitMateRouter;
