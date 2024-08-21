const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {type:String,required: true, unique: true},
    userPW: {type: String},
    phone: {type:String},
    startDate: {type: Date},
    endDate: {type: Date},
    numberOfPeople: {type: Number}
});

const User = mongoose.model('User', userSchema);

module.exports = User;