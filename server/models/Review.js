const Review = (Sequelize, DataTypes) => {
  const review = Sequelize.define(
    'review',
    {
      reviewId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '평점',
      },
      writerId: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: '평점을 남기는 유저 아이디',
      },
    },
    {
      tableName: 'review',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return review;
};

module.exports = Review;
