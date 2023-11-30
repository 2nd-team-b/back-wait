'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const User = require('./User')(sequelize, Sequelize);
const Proxy = require('./Proxy')(sequelize, Sequelize);
const WaitMate = require('./WaitMate')(sequelize, Sequelize);
const Review = require('./Review')(sequelize, Sequelize);
const ChatRoom = require('./ChatRoom')(sequelize, Sequelize);
const LikeWait = require('./LikeWait')(sequelize, Sequelize);
const Payment = require('./Payment')(sequelize, Sequelize);
const Reservations = require('./Reservations')(sequelize, Sequelize);

User.hasMany(WaitMate, {
  foreignKey: 'id',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
WaitMate.belongsTo(User, { foreignKey: 'id', targetKey: 'id' });

User.hasMany(Proxy, {
  foreignKey: 'id',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
Proxy.belongsTo(User, { foreignKey: 'id', targetKey: 'id' });

User.hasMany(Review, {
  foreignKey: 'id',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
Review.belongsTo(User, { foreignKey: 'id', targetKey: 'id' });

Proxy.hasOne(ChatRoom, {
  foreignKey: 'proxyId',
  sourceKey: 'proxyId',
  onDelete: 'CASCADE',
});
ChatRoom.belongsTo(Proxy, { foreignKey: 'proxyId', targetKey: 'proxyId' });

WaitMate.hasOne(ChatRoom, {
  foreignKey: 'wmId',
  sourceKey: 'wmId',
  onDelete: 'CASCADE',
});
ChatRoom.belongsTo(WaitMate, { foreignKey: 'wmId', targetKey: 'wmId' });

User.hasMany(LikeWait, {
  foreignKey: 'id',
  sourceKey: 'id',
  onDelete: 'CASCADE',
});
LikeWait.belongsTo(User, {
  foreignKey: 'id',
  targetKey: 'id',
  allowNull: false,
});
WaitMate.hasMany(LikeWait, {
  foreignKey: 'wmId',
  sourceKey: 'wmId',
  onDelete: 'CASCADE',
});
LikeWait.belongsTo(WaitMate, {
  foreignKey: 'wmId',
  targetKey: 'wmId',
  allowNull: false,
});
Payment.belongsTo(User, {
  foreignKey: 'payerId',
  as: 'payer',
});
Payment.belongsTo(User, {
  foreignKey: 'payeeId',
  as: 'payee',
});

WaitMate.hasOne(Reservations, {
  foreignKey: 'wmId',
  sourceKey: 'wmId',
  onDelete: 'CASCADE',
});
Reservations.belongsTo(WaitMate, {
  foreignKey: 'wmId',
  targetKey: 'wmId',
  allowNull: false,
});
Proxy.hasMany(Reservations, {
  foreignKey: 'proxyId',
  sourceKey: 'proxyId',
  onDelete: 'CASCADE',
});
Reservations.belongsTo(Proxy, {
  foreignKey: 'proxyId',
  targetKey: 'proxyId',
  allowNull: false,
});

db.User = User;
db.Proxy = Proxy;
db.WaitMate = WaitMate;
db.Review = Review;
db.ChatRoom = ChatRoom;
db.LikeWait = LikeWait;
db.Reservations = Reservations;
db.Payment = Payment;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
