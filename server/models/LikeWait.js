const LikeWait = (Sequelize, DataTypes) => {
  const likeWait = Sequelize.define(
    'likeWait',
    {
      likeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      wmId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '웨메 아이디',
      },
      proxyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '프록시 아이디',
      },
    },
    {
      tableName: 'likeWait',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return likeWait;
};

module.exports = LikeWait;
