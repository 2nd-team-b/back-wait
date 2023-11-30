const Reservations = (Sequelize, DataTypes) => {
  const reservations = Sequelize.define(
    'reservations',
    {
      reservationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      state: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: '예약중(true), 거래완료(마감)(false)',
      },
    },
    {
      tableName: 'reservations',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return reservations;
};

module.exports = Reservations;
