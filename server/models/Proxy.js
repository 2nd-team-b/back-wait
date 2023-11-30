const Proxy = (Sequelize, DataTypes) => {
  const proxy = Sequelize.define(
    'proxy',
    {
      proxyId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title:{
        type: DataTypes.STRING(250),
        allowNull : false,
        comment : '프록시가 올리는 제목'
      },
      proxyAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: '프록시의 주소',
      },
      gender: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: '성별',
      },
      age: {
        type: DataTypes.STRING(150),
        allowNull: false,
        comment: '나이',
      },
      proxyMsg: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: '웨이트 메이트에게 전하고 싶은 말',
      },
      photo: {
        type: DataTypes.STRING(150),
        allowNull: null,
        comment: '사진',
      },
    },
    {
      tableName: 'proxy',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return proxy;
};

module.exports = Proxy;
