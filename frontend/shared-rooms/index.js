import express from "express";
import { PORT } from "./config.js";

import dotenv from "dotenv";
import cors from 'cors';
import pool from "./db.cjs";
import cookieParser from "cookie-parser";
import ViteExpress from "vite-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
import verify from "jsonwebtoken";
import { BrowserRouter, Navigate } from "react-router-dom";
import { useEffect } from "react";



dotenv.config();

const sercretKey = process.env.JWT_SECRET;
var app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser(sercretKey));

let currentUserId;


//TODO: add data validation


// Create a room with data
app.post("/room", async (req, res) => {
    try {
        const room_name = req.body.room_name;
        const room_price = req.body.room_price;
        const room_description = req.body.room_description;
        const room_photo = req.body.room_photo;

        const newRoom = await pool.query("INSERT INTO room (room_name, room_price, room_description, room_photo) VALUES($1, $2, $3, $4)", [room_name, room_price, room_description, room_photo]);

        res.status(200).json(newRoom);

    } catch (err) {
        console.error(`Error occured while creating a room: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a room with provided room name
app.get("/room", async (req, res) => {
    const roomName = req.query.roomName;
    let currentRoom;

    try {
        currentRoom = await pool.query("SELECT * FROM room WHERE room_name = $1", [roomName]);
    } catch (e) {
        console.log(`Error occured while getting a room information: ${e.message}`);
        return res.status(500);
    }

    return res.status(200).json(currentRoom);

})

// Get a room with room id
app.get("/room/:id", async (req, res) => {
    try {
        const currentRoomID = req.params.id;
        const currentRoom = await pool.query("SELECT * FROM room WHERE room_id = $1", [currentRoomID]);
        return res.status(200).json(currentRoom.rows);

    } catch (error) {
        console.error(`Error occured while getting a room: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a room information with provided information
app.put("/room/:id", async (req, res) => {
    try {
        const currentRoomID = req.params.id;
        const updateRoomInfo = req.body;
        const currentRoom = await pool.query("UPDATE room SET room_name = $1, room_price = $2, room_description = $3, room_photo = $4 WHERE room_id = $5", [updateRoomInfo.room_name, updateRoomInfo.room_price, updateRoomInfo.room_description, updateRoomInfo.room_photo, currentRoomID]);
        res.status(200).json(currentRoom.rows);

    } catch (error) {
        console.error(`Error occured while updating a room: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a room with room id
app.delete("/room/:id", async (req, res) => {
    let deleteRoom;
    try {
        const currentRoomID = req.params.id;
        deleteRoom = await pool.query("DELETE FROM room WHERE room_id = $1", [currentRoomID]);
    } catch (error) {
        console.error(`Error occured while deleting a room: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
    return res.status(200);
});

// Create a user
//user_name shouldn't be duplicated
//user_password should be hashed
//todo: after creating a user, the user should be logged in automatically. (handling cookie!!)
app.post("/user", async (req, res) => {


    let isNameExist;
    let isAddSuccess;
    let currentUserId;

    try {

        //get a user information 
        const user_name = req.body.user_name;
        const user_password = req.body.user_password;
        const user_email = req.body.user_email;
        const user_phone = req.body.user_phone;

        //check if a name is already exist
        isNameExist = await pool.query("SELECT * FROM app_user WHERE user_name = $1", [user_name]);
        if (isNameExist == 0) {
            return res.status(400).json({ error: `User name (${user_name}) is already exist` });
        }

        //insert user information (create)
        // isAddSuccess = await pool.query("INSERT INTO app_user (user_name, user_password, user_email, user_phone) VALUES($1, crypt($2, gen_salt('md5')), $3, $4)", [user_name, user_password, user_email, user_phone]);

        isAddSuccess = await pool.query("INSERT INTO app_user (user_name, user_password, user_email, user_phone) VALUES($1, $2, $3, $4)", [user_name, user_password, user_email, user_phone]);

        //get a current user id based on user's name
        currentUserId = await pool.query("SELECT user_id FROM app_user WHERE user_name = $1", [user_name]);


    } catch (err) {
        console.error(`Error occured while creating a user: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const accessToken = jwt.sign({ id: currentUserId.rows[0].user_id }, sercretKey);
    res.cookie(currentUserId.rows[0].user_id, accessToken, { maxAge: 1200000 });
    res.status(200).json({
        user_id: currentUserId.rows[0].user_id,
        accessToken
    });

    //navigate to Home

});



//Update user information
// cannot change user name
app.put("/user/:id", async (req, res) => {

    let updatedUser;

    try {
        const currentUserId = req.params.id;
        const userInfo = req.body;
        updatedUser = await pool.query("UPDATE app_user SET user_password = crypt($1, gen_salt('md5')), user_phone = $2, user_email = $3 WHERE user_id = $4", [userInfo.user_password, userInfo.user_phone, userInfo.user_email, currentUserId]);

    } catch (error) {
        console.error(`Error occured while updating a user info: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(200);

});


//Get user information
app.get("/user/:id", async (req, res) => {
    let user;
    const userId = req.params.id;
    try {
        user = await pool.query("SELECT * FROM app_user WHERE user_id = $1", [userId]);
    } catch (error) {
        console.error(`Error occured while getting a user information: ${error.message}`);
        return res.status(500).json({ error: 'server error' });
    }

    return res.status(200).json(user);
})

// delete user
app.delete('/user/:id', async (req, res) => {
    let currentUser;

    try {

        // current id
        const currentUserId = req.params.id;
        currentUser = await pool.query("DELETE FROM app_user WHERE user_id = $1", [currentUserId]);

    } catch (error) {
        console.error(`Error occured while deleting a user: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    console.log(currentUser.rowCount);
    if (currentUser.rowCount != 0) {
        console.log(`User is deleted`);
        // TODO: User should be logged out.
        // TODO: delete current cookie
        return res.status(200);
    } else {
        console.log(`User hasn't deleted`);
    }
});

// user login
app.post('/user/login', async (req, res) => {

    let loginUser;
    const user_password = req.body.user_password;
    const user_name = req.body.user_name;

    try {

        loginUser = await pool.query("SELECT * FROM app_user WHERE $1 = user_password AND $2 = user_name", [user_password, user_name]);

    } catch (error) {
        console.error(`Error occured while login with a user id: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }


    if (loginUser.rowCount != 0) {

        //generate Token
        const accessToken = jwt.sign({ id: loginUser.rows[0].user_id }, sercretKey);

        currentUserId = loginUser.rows[0].user_id;
        res.cookie(currentUserId, accessToken, { maxAge: 1200000 });

        //user_id: loginUser.rows[0].user_id,
        res.status(200).json({
            user_id: accessToken.id,
            accessToken
        });
    }
    console.log(`current user id: ${currentUserId}`);

});


app.get('/MyPage/:id', async (req, res) => {

    const currentUserId = req.params.id;

    console.log(`user id from api call: ${currentUserId}`);

    //bring all reservations with user id
    let allReservations;

    try {
        allReservations = await pool.query("SELECT * FROM reservation r INNER JOIN room rm ON r.room_id = rm.room_id AND user_id = $1", [currentUserId]);

    } catch (error) {
        console.error(`Error occured while getting all rooms: ${error.message}`)
        return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(allReservations);
})



// create a reservation
app.post("/reservation", async (req, res) => {

    const currentRoomId = req.body.room_id.roomId;
    const start_date = req.body.start_date.startDate;
    const end_date = req.body.end_date.endDate;
    let newReservation;
    let pricePerNightPromise;
    let pricePerNight;
    let stay_days = calculateDays(start_date, end_date);
    const user_id = currentUserId;
    let total_price = 0;
    let newReservationPromise;
    let reservationId;
    let updateReservationPromise;

    try {
        newReservation = await pool.query("INSERT INTO reservation (start_date, end_date, room_id, user_id) VALUES(TO_DATE($1::text, 'YYYY-MM-DD'), TO_DATE($2::text, 'YYYY-MM-DD'), $3, $4)", [start_date, end_date, currentRoomId, user_id]);

        //if inserting is success, keep doing it
        //if not, do noting

        if (newReservation.rowCount == 1) {

            newReservationPromise = await pool.query("SELECT (reservation_id) FROM reservation WHERE start_date = TO_DATE($1::text, 'YYYY-MM-DD') AND end_date = TO_DATE($2::text, 'YYYY-MM-DD') AND user_id = $3 AND room_id = $4", [start_date, end_date, user_id, currentRoomId]);
            console.log(`new generated id: ${newReservationPromise.rows[0].reservation_id}`);
            reservationId = newReservationPromise.rows[0].reservation_id;


            pricePerNightPromise = await pool.query("SELECT (room_price) FROM room WHERE room_id = $1", [currentRoomId]);
            // //update price and query 
            pricePerNight = pricePerNightPromise.rows[0].room_price;
            total_price = pricePerNight * stay_days;
            updateReservationPromise = await pool.query("UPDATE reservation SET total_price = $1 WHERE reservation_id = $2", [total_price, reservationId]);

        } else {
            return res.status(500).json({ Error: 'SQL: Inserting failed' });
        }

    } catch (err) {
        console.error(`Error occured while creating a reservation: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

});


// calculate stay days
function calculateDays(startDate, endDate) {
    let start_date = new Date(startDate);
    let end_date = new Date(endDate);

    let difference_in_time = end_date.getTime() - start_date.getTime();
    let difference_in_days = Math.round(difference_in_time / (1000 * 3600 * 24));

    return difference_in_days;
}

// get a list of reservations

app.get("/reservations/:id", async (req, res) => {

    //todo
    const currentUserId = req.params.id;

    let allReservations;

    try {
        allReservations = await pool.query("SELECT * FROM reservation r INNER JOIN room rm ON r.room_id = rm.room_id AND user_id = $1", [currentUserId]);

    } catch (error) {
        console.error(`Error occured while getting all rooms: ${error.message}`)
        return res.status(500).json({ error: 'Internal server error' });
    }

});

// Get available rooms based on selected start/endDate
app.get("/reservations", async (req, res) => {


    const startDateFromQuery = req.query.startDate;
    const endDateFromQuery = req.query.endDate;
    let availableRooms;

    try {
        // Search available rooms
        availableRooms = await pool.query("SELECT * FROM room WHERE room_id NOT IN (SELECT room_id from reservation WHERE start_date >= TO_DATE($2::text, 'YYYY-MM-DD') AND end_date <= TO_DATE($1::text, 'YYYY-MM-DD'))", [endDateFromQuery, startDateFromQuery]);

    } catch (error) {
        console.error(`Error occured while getting available rooms: ${error.message}`);
    }
    return res.status(200).json(availableRooms);
});



// delete a reservation
// user clicks a delete button from a reservation list to delete
// todo: current logged in user, selected room id
// id = reservation id
app.delete("/reservation/:id", async (req, res) => {
    try {
        const currentReservationId = req.params.id;

        const deleteReservation = await pool.query("DELETE FROM reservation WHERE reservation_id = $1", [currentReservationId])
            .then((deleted) => {
                if (deleted.rowCount == 0) {
                    console.log(`success to delete : ${deleted.rowCount}`);
                    res.status(200);
                }
            });


    } catch (error) {
        console.error(`Error occured while deleting a room: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


ViteExpress.listen(app, PORT, () => {
    console.log(`App is listening to port ${PORT}`);


})
