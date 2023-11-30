
const Room = require('../schema/Room');

// Room 생성 및 저장 로직을 컨트롤러 함수로 이동
const createRoom = async (data, activeRooms, io, socket) => {
  if (data.sender === data.receiver) {
    socket.emit('roomError', 'Cannot chat with yourself');
    return;
  }

  if (activeRooms.has(data.roomNumber)) {
    socket.emit('roomError', 'Room already exists');
    return;
  }
  
  if (
    io.sockets.adapter.rooms.get(data.roomNumber) &&
    io.sockets.adapter.rooms.get(data.roomNumber).size >= 2
  ) {
    socket.emit('roomError', 'Room is full');
    return;
  }

  try {
    const newRoom = new Room({
      roomNumber: data.roomNumber,
      receiver: data.receiver,
      sender: data.sender,
      proxyId : data.proxyId,
    });

    await newRoom.save();

    socket.join(data.roomNumber);
    activeRooms.add(data.roomNumber);

    socket.emit('roomCreated', { roomNumber: data.roomNumber });
  } catch (error) {
    console.error('Error creating a chat room:', error);
  }
};

module.exports = {
  createRoom, // 컨트롤러 함수를 내보냅니다.
};