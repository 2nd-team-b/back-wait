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
      wmDetailAddress: {
        type: DataTypes.STRING(250),
        allowNull: true,
        comment: '웨이트메이트가 원하는 장소의 상세주소',
      },
      lng: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '경도',
      },
      lat: {
        type: DataTypes.STRING(250),
        allowNull: false,
        comment: '위도',
      },
      waitTime: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: '기다리는 날짜',
      },
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: '장소들에 대한 설명',
      },
      pay: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '결제 요금',
      },
      photo: {
        type: DataTypes.STRING(150),
        allowNull: true,
        comment: '사진',
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: '조회수',
      },
      state: {
        type: DataTypes.STRING(150),
        defaultValue: 'active',
        comment: '상태(디폴트(active), 예약중(reserved), 거래완료(completed))',
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: '시작 시간',
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: '마감 시간',
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
