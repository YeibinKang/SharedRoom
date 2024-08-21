const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    details: {type: String},
    photo: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    numberOfPeople: {type: Number}
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;