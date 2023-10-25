const WaitMate = (Sequelize, DataTypes) => {
  const waitMate = Sequelize.define(
    'waitMate',
    {
      wmId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '구인글 제목',
      },
      wmAddress: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '웨이트메이트가 원하는 장소',
      },
      waitTime: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '기다려야 하는 시간',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '장소들에 대한 설명',
      },
      pay: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '결제 요금',
      },
      photo: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: '사진',
      },
    },
    {
      tableName: 'waitMate',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return waitMate;
};

module.exports = WaitMate;
