const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    sender: {
        type: Number, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    receiver: {
        type: Number, // 또는 String, 데이터 유형에 따라 변경
        required: true,
    },
    proxyId : {
        type: Number,
        required : true
    },
    wmId : {
        type: Number,
        required : true
    },
    roomNumber : {
        type : Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



const Room = mongoose.model('Room', roomSchema);

module.exports = Room;