const { WaitMate } = require('../models');

// post: resiter
exports.postRegister = async (req, res) => {
  // 요청에서 받을 데이터
  //  - title(varchar(150)),wmAddress(varchar(150)),waitTime(varchar(250)),description(text),pay(int, allowNull),photo(경로?)(varchar(150))
  // 응답 데이터
  // - success/fail
  // 요청이 들어오면 req에서 데이터를 토데로 create문을 작성
  // 성공하면 success, 실패하면 fail을 보냄
  console.log(req.body); // 아래 결과
  // {
  //   title: '사람구합니다.',
  //   wmAddress: '서울시송파구',
  //   waitTime: '1024',
  //   description: '배고파요',
  //   photo: '찰칵'
  // }
  ///////////////////////////////////////////////////////////////////////////
  try {
    const { title, wmAddress, waitTime, description, pay, photo } = req.body;
    // DB에 웨메 등록
    const insertWaitMate = await WaitMate.create({
      title: title,
      wmAddress: wmAddress,
      waitTime: waitTime,
      description: description,
      pay: pay,
      photo: photo,
    });
    if (insertWaitMate) {
      res.send({ result: 'success' });
    } else {
      console.log(insertWaitMate);
      res.send({ result: 'fail' });
    }
  } catch (e) {
    console.log('error:', e);
  }
};
