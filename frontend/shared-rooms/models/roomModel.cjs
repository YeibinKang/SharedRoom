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

// const userSchema = new mongoose.Schema({
//     userID: {type:String,required: true, unique: true},
//     userPW: {type: String},
//     phone: {type:String},
//     startDate: {type: Date},
//     endDate: {type: Date},
//     numberOfPeople: {type: Number},
//     rooms: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
// });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
//const User = mongoose.model('User', userSchema);

//module.exports = {Room, User};