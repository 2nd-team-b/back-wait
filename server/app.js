const express = require('express');
const mongooseConnect = require('./schema');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const app = express();
const path = require('path');
const Router = require('./routes');
const PORT = 8080;
const cors = require('cors');
require('dotenv').config();
const setupSocket = require('./socket.js');
const http = require('http');

// 익스프레스에서 json 사용하도록 해줌
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//cors 설정
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://ec2-13-124-56-103.ap-northeast-2.compute.amazonaws.com:3000',
      'https://sesac-projects.site',
      'http://localhost:3000'
    ],
    credentials: true,
  })
);

app.use('/public', express.static(path.join(__dirname, 'public')));

// router 설정
const home = require('./routes/index');
app.use('', home);

//시퀄라이즈 설정
const { sequelize } = require('./models');

sequelize.sync({ force: false });

// 소켓 연결 (http 서버를 생성하고 소켓 서버로 사용)
const server = http.createServer(app);
setupSocket(server);

//몽구스 연결
mongooseConnect();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
