import express from "express";
import mongoose from "mongoose";
import { PORT, dbURL } from "./config.js";
import { createRequire } from 'module';
import { error } from "console";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from 'cors';

import createHashedPW from "./authentication/createHashedPW.mjs";
import generateToken from "./authentication/generateToken.mjs";
import cookieParser from "cookie-parser";

var app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser());
dotenv.config();

const require = createRequire(import.meta.url);

const Room = require('./models/roomModel.cjs');
const User = require('./models/userModel.cjs');

//TODO:Additional
const RoomData = require('./models/dataModel.cjs');
const UserData = require('./models/dataModel.cjs');

const sercretKey = process.env.JWT_SECRET;

// DB connection
mongoose.connect(dbURL)
    .then(() => {
        console.log('App is connected to db');

    })
    .catch((err) => {
        console.log(err);
    });

// Room
// GET method route
app.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }

});

//TODO: TESTED Add Roomdb into Userdb (in dataModel.cjs)
// POST method route CREATE
app.post('/data/', async (req, res) => {
    try {

        const tempUser = new UserData({
            userID: req.body.userID,
            userPW: req.body.userPW,
        });

        console.log(`room's name: ${req.body.rooms[0].name}`);
        tempUser.rooms.push({
                name: req.body.rooms[0].name,
                price: req.body.rooms[0].price,
                details: req.body.rooms[0].details,
                photo: req.body.rooms[0].photo,
        });

        // const newUser = await new UserData({
            
        //     // room: {
        //     //     name: req.body.room.name,
        //     //     price: req.body.room.price,
        //     //     details: req.body.room.details,
        //     //     photo: req.body.room.photo,
        //     // }
        // });

        // newUser.room.push({
        //     name: req.body.room.name,
        //     price: req.body.room.price,
        //     details: req.body.room.details,
        //     photo: req.body.room.photo
        // });

        //newUser.save();

        tempUser.save();
        return res.status(200).json(tempUser);

    } catch (err) {
        console.error(`POST failed for creating room :`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET method with id
app.get('/:id', async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

// POST method route CREATE
app.post('/', async (req, res) => {
    try {

        const newRoom = await new Room({
            name: req.body.name,
            price: req.body.price,
            details: req.body.details,
            photo: req.body.photo,
        });
        newRoom.save();
        return res.status(200).json(newRoom);

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT method - Edit
app.put('/:id', async (req, res) => {
    //res.send('PUT request to the homepage');
    const roomId = req.params.id;
    try {
        // if id is matched with one of data (using findById())
        // edit the data

        const currentRoom = await Room.findById(roomId);

        if (!currentRoom) {
            return res.status(400).json({ error: `Room not found for ID: ${roomId}` })
        } else {

            currentRoom.name = req.body.name;
            currentRoom.price = req.body.price;
            currentRoom.details = req.body.details;
            currentRoom.photo = req.body.photo;

            currentRoom.save();
            console.log(`Saved ${currentRoom} for id ${roomId}`);
        }

        return res.status(200).json(currentRoom);

    } catch (err) {
        console.error(`PUT failed for ${roomId}`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// DELETE
app.delete('/:id', async (req, res) => {

    try {

        const currentRoom = await Room.findById(req.params.id);
        console.log(currentRoom);

        if (!currentRoom) {
            console.log("Room not found");
        } else {
            const deleteRoom = await Room.deleteOne(currentRoom);

            return res.status(200).json(deleteRoom);
        }

    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Create a user information
app.post('/registration', async (req, res) => {
    // not duplicated,
    //create one user
    // duplicated, error
    const userId = req.body.userID;
    const idExisted = await User.findOne({ userID: userId })
        .then((user) => {
            try {
                if (user) {
                    console.error(`User Registration FAIL for ${userId}: Duplicated user ID `, error);
                } else {
                    createHashedPW(req, res);

                }
            } catch (err) {
                console.error(`POST failed for ${userId}`, err);
                res.status(500).json({ error: 'Internal server error' });
            }

        });
});

// User information update
// pre-requirement: user Must be logged in. 
app.put('/user/edit/:id', async (req, res) => {
    // TODO: is the user logged in?
    // when user clicks the edit button, the link should have the user's id
    // no need to check..??
    const currentUserId = req.params.id;
    try {

        const currentUser = await User.findById(currentUserId);
        console.log(`Current user is ${currentUser.userID}`);

        createHashedPW(req, res);

        currentUser.phone = req.body.phone;

        console.log(`Updated ${currentUser.userID}`);

        currentUser.save();

        return res.status(200).json(currentUser);

    } catch (err) {
        console.error(`PUT failed for ${currentUserId}`, err);
        res.status(500).json({ error: 'Internal server error' });
    }

});

// User information delete
app.delete('/user/delete/:id', async (req, res) => {
    //TODO: check if the user is logged in
    const currentUserId = req.params.id;

    try {
        const currentUser = await User.findById(currentUserId);
        console.log(`Current user is ${currentUser.userID}`);

        if (!currentUser) {
            console.log("User not found");
        } else {
            const deleteUser = await User.deleteOne(currentUser);
            console.log(`${deleteUser.userID} is deleted`);

            //TODO: the user should be logged out


            return res.status(200).json(deleteUser);
        }

    } catch (err) {
        console.error(`DELETE failed for ${currentUserId}`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


// User Login
// TODO: GET?? 
app.post('/user/login', async (req, res) => {
    const user = await User.findOne({ userID: req.body.userID });
    try {

        const isPWMatched = await bcrypt.compare(req.body.userPW, user.userPW);
        console.log(`The answer from compare PW: ${isPWMatched}`);

        if (isPWMatched) {
            //login
            //const token = generateToken(user, req, res);
            const token = jwt.sign({ id: user.userID, role: "user" }, process.env.JWT_SECRET);
            return res.cookie("access_token", token, { httpOnly: true, secure: process.env.JWT_SECRET })
                .status(200)
                .json({ message: "Cookie is created" });
        }
    } catch (err) {
        console.error(`POST failed for ${user.userID} Login`, err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//user make a reservation
// update data 
// TODO: bring current user
// add room information in userDB
// PUT
// app.put('/user/reservation/:id', async (req, res) => {
//     const currentUserId = req.params.id;

//     try {
//         const currentUser = await User.findById(currentUserId);



//         console.log(`Current user is ${currentUser.userID}`);

//         if (!currentUser) {
//             console.log("User not found");
//         } else {
//             // todo: edit user's db
//             currentUser.rooms.name = req.body.roomName;
//             currentUser.rooms.price = req.body.roomPrice;
//             currentUser.rooms.details = req.body.roomDetails;
//             currentUser.rooms.photo = req.body.roomPhoto;

//             currentUser.save();
//             console.log(`Saved ${currentRoom} for id ${roomId}`);


//             return res.status(200).json(deleteUser);
//         }

//     } catch (err) {
//         console.error(`Edit failed for ${currentUserId}`, err);
//         res.status(500).json({ error: 'Internal server error' });
//     }


// });

//TEST
//TODO: POST




app.listen(PORT, () => {
    console.log(`App is listening to port ${PORT}`);


});

