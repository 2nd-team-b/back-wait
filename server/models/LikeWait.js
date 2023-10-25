const LikeWait = (Sequelize, DataTypes) => {
  const likeWait = Sequelize.define(
    'likeWait',
    {
      likeId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
