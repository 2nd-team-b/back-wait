const express = require('express');

const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const Router = require('./routes');
const PORT = 8080;
const cors = require('cors');
require('dotenv').config();

// 익스프레스에서 json 사용하도록 해줌
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/api', Router);

// router 설정
const home = require('./routes/index');
app.use('/', home);

//시퀄라이즈 설정
const { sequelize } = require('./models');

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log('8080 port is running');
    });
  })
  .catch(() => {
    console.log('데이터 베이스 연결 실패');
  });
