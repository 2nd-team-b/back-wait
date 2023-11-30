const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(`mongodb://${process.env.MONGOUSER}:${process.env.MONGOPWD}@52.79.150.175:27017/admin`, {
        dbName: 'chat',
        useNewUrlParser: true,
    });

    const db = mongoose.connection;

    db.on('error', (error) => {
        console.error('몽고디비 연결 에러', error);
    });

    db.on('disconnected', () => {
        console.error('몽고 디비 연결이 끊어졌습니다');
        connect();
    });

    db.once('open', () => {
        console.log('몽고 디비 연결 성공');
    });
};

module.exports = connect;