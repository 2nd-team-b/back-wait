const ChatRoom = (Sequelize, DataTypes) => {
  const chatRoom = Sequelize.define(
    'chatRoom',
    {
      chatId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    {
      tableName: 'chatRoom',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return chatRoom;
};

module.exports = ChatRoom;
