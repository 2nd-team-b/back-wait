const Payment = (Sequelize, DataTypes) => {
  const payment = Sequelize.define(
    'payment',
    {
      paymentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title : {
        type: DataTypes.STRING(255),
        allowNull : false,
      },
      payerId : {
        type: DataTypes.INTEGER,
        allowNull : false
      },
      payeeId : {
        type: DataTypes.INTEGER,
        allowNull : false
      },
      amount : {
        type: DataTypes.INTEGER,
        allowNull : false,
      },
      
    },
    {
      tableName: 'payment',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return payment;
};

module.exports = Payment;