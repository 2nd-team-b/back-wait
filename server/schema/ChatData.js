const mongoose = require('mongoose');

const chatDataSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
        ref: 'Room',
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    receiver: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
        required: true,
    },
    messageContent: {
        type: String, 
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const ChatData = mongoose.model('ChatData', chatDataSchema);

module.exports = ChatData;