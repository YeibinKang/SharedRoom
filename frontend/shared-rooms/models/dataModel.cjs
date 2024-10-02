const Mongoose = require('mongoose');

const RoomDataSchema = new Mongoose.Schema({
    name: {type: String},
    price: {type: Number},
    details: {type: String},
    photo: {type: String},
    startDate: {type: Date},
    endDate: {type: Date},
    numberOfPeople: {type: Number}
});

const UserDataSchema = new Mongoose.Schema({
    userID: {type:String,required: true, unique: true},
    userPW: {type: String},
    phone: {type:String},
    startDate: {type: Date},
    endDate: {type: Date},
    numberOfPeople: {type: Number},
    
    //rooms:{type: Mongoose.ObjectId, ref:'RoomData'}
    rooms:[RoomDataSchema]
});

//room: {type: Mongoose.Schema.Types.ObjectId, ref:'RoomData'},

const RoomData = Mongoose.model('RoomData', RoomDataSchema);

const UserData = Mongoose.model('UserData', UserDataSchema);

module.exports = RoomData;
module.exports = UserData;