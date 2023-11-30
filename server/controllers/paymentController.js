const axios = require('axios');
const KAKAO_ADMIN_KEY = process.env.KAKAO_ADMIN_KEY;
const { WaitMate, User, Payment } = require('../models');
const currSuver = 'https://sesac-projects.site/wapi';
const Common = require('../common');
const db = require('../models');
const sequelize = db.sequelize;

exports.kakaoPay = async (req, res) => {
  try {
    const userInfo = await Common.cookieUserinfo(req);
    const { wmId, id } = req.body;
    const response = await WaitMate.findOne({ where: { wmId: wmId } });
    const { title, pay } = response.dataValues;
    if (pay > userInfo.wallet) {
      res.status(400).json({ message: '결제 가능 금액이 부족합니다.' });
      return;
    }
    const paymentInfo = {
      cid: 'TC0ONETIME',
      partner_order_id: 'order',
      partner_user_id: 'user',
      item_name: `${title}`,
      quantity: 1,
      total_amount: pay,
      tax_free_amount: 0,
      approval_url: `${currSuver}/payment/kakao/success?plus=${id}&pay=${pay}&minus=${userInfo.id}&title=${title}`,
      cancel_url: `${currSuver}/payment/kakao/cancel`,
      fail_url: `${currSuver}/payment/kakao/fail`,
    };
    const kakaoResponse = await axios.post(
      'https://kapi.kakao.com/v1/payment/ready',
      paymentInfo,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
    const { next_redirect_pc_url } = kakaoResponse.data;
    res.json({ redirectUrl: next_redirect_pc_url });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
};
exports.success = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let { plus, pay, minus, title } = req.query;
    plus = parseInt(plus, 10);
    pay = parseFloat(pay);
    minus = parseInt(minus, 10);
    if (isNaN(plus) || isNaN(minus) || isNaN(pay)) {
      throw new Error('올바르지 못한 타입');
    }
    if (typeof title !== 'string') {
      throw new Error('올바르지 않은 타입');
    }
    const plusUser = await User.findOne({ where: { id: plus }, transaction });
    const minusUser = await User.findOne({ where: { id: minus }, transaction });
    if (!plusUser || !minusUser) {
      throw new Error('올바르지 못한 유저');
    }
    const plusWallet = plusUser.dataValues.wallet;
    const minusWallet = minusUser.dataValues.wallet;
    await User.update(
      {
        wallet: plusWallet + pay,
      },
      {
        where: { id: plus },
        transaction,
      }
    );
    await User.update(
      { wallet: minusWallet - pay },
      {
        where: { id: minus },
        transaction,
      }
    );
    await Payment.create(
      {
        title,
        payer: minus,
        payee: plus,
        amount: pay,
      },
      { transaction }
    );
    await transaction.commit();
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
          결제가 성공적으로 완료되었습니다.<br/>채팅 리스트로 이동합니다.</h1>
        <script>
          const reload = () => {
            return setTimeout(() => {window.location.href='https://sesac-projects.site/waitmate/myPage/Chatlist'}, 1000)
          }
          reload();
        </script>
      </body>
    </html>
  `);
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error(error);
    if (error.message === '결제 가능한 금액이 남아 있지 않습니다') {
      res
        .status(400)
        .json({ message: '결제 가능한 금액이 남아 있지 않습니다' });
    } else if (error.message === '올바르지 못한 유저') {
      res.status(404).json({ message: '올바르지 못한 유저' });
    } else {
      res.status(500).json({ message: '알 수 없는 서버 에러' });
    }
  }
};
exports.cancel = (req, res) => {
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
          결제를 취소하셨습니다.<br/>채팅 리스트로 이동합니다.</h1>
        <script>
          const reload = () => {
            return setTimeout(() => {window.location.href='https://sesac-projects.site/waitmate/myPage/Chatlist'}, 1000)
          }
          reload();
        </script>
      </body>
    </html>
  `);
};
exports.fail = (req, res) => {
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
        알 수 없는 에러가 발생하였습니다.<br/>채팅 리스트로 이동합니다.</h1>
      <script>
        const reload = () => {
          return setTimeout(() => {window.location.href='https://sesac-projects.site/waitmate/myPage/Chatlist'}, 1000)
        }
        reload();
      </script>
    </body>
  </html>
`);
};
