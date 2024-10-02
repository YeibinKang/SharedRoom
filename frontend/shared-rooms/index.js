import express from "express";
import { PORT } from "./config.js";

import dotenv from "dotenv";
import cors from 'cors';
import pool from "./db.cjs";
import cookieParser from "cookie-parser";
import ViteExpress from "vite-express";
import jwt from "express-jwt";
import jsonwebtoken from "jsonwebtoken";


dotenv.config();

const sercretKey = process.env.JWT_SECRET;
var app = express();
app.use(cors());

app.use(express.json());
app.use(cookieParser(sercretKey));


// Create a room with data
app.post("/room", async(req, res)=>{
    try{
        const room_name = req.body.room_name;
        const room_price = req.body.room_price;
        const room_description = req.body.room_description;
        const room_photo = req.body.room_photo;

        const newRoom = await pool.query("INSERT INTO room (room_name, room_price, room_description, room_photo) VALUES($1, $2, $3, $4)", [room_name, room_price, room_description, room_photo]);

        res.status(200).json(newRoom);

    }catch(err){
        console.error(`Error occured while creating a room: ${err.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a room with provided room name
app.get("/room", async(req, res) => {
    const roomName = req.query.roomName;
    let currentRoom;

    try{
        currentRoom = await pool.query("SELECT * FROM room WHERE room_name = $1",[roomName]);
    }catch(e){
        console.log(`Error occured while getting a room information: ${e.message}`);
        return res.status(500);
    }

    return res.status(200).json(currentRoom);
    
})

// Get a room with room id
app.get("/room/:id", async(req,res)=>{
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
app.put("/room/:id", async(req, res) => {
    try {
        const currentRoomID = req.params.id;
        const updateRoomInfo = req.body;
        const currentRoom = await pool.query("UPDATE room SET room_name = $1, room_price = $2, room_description = $3, room_photo = $4 WHERE room_id = $5", [updateRoomInfo.room_name, updateRoomInfo.room_price, updateRoomInfo.room_description,updateRoomInfo.room_photo, currentRoomID]);
        res.status(200).json(currentRoom.rows);
        
    } catch (error) {
        console.error(`Error occured while updating a room: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a room with room id
app.delete("/room/:id", async(req, res) => {
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
    //todo: after creating a user, the user should be logged in automatically.
app.post("/user", async(req, res)=>{

    let isNameExist;
    let isAddSuccess;
    let currentUserId;

    try{

        //get a user information 
        const user_name = req.body.user_name;
        const user_password = req.body.user_password;
        const user_email = req.body.user_email;
        const user_phone = req.body.user_phone;
        // const user_id = req.body.user_id; //todo: 

        //check if a name is already exist
        isNameExist = await pool.query("SELECT * FROM app_user WHERE user_name = $1", [user_name]);        
        if (isNameExist == 0) {
            return res.status(400).json({error: `User name (${user_name}) is already exist`});
        }

        //insert user information (create)
        isAddSuccess = await pool.query("INSERT INTO app_user (user_name, user_password, user_email, user_phone) VALUES($1, crypt($2, gen_salt('md5')), $3, $4)", [user_name, user_password, user_email, user_phone]);
        
        //get a current user id based on user's name
        currentUserId = await pool.query("SELECT user_id FROM app_user WHERE user_name = $1", [user_name]);
        

    } catch(err){
        console.error(`Error occured while creating a user: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

    //res.status(200).json({token: jsonwebtoken.sign({user_id: currentUserId}, process.env.JWT_SECRET)});

    console.log(currentUserId.rows[0].user_id);
     //set a token
     //todo: why it doesn't create a token??
    const token = jsonwebtoken.sign({user_id:currentUserId.rows[0].user_id}, process.env.JWT_SECRET);
    
     res.cookie("token", token, {maxAge: 1000*60*60});
     res.status(200).json({token});

});

// update user information
    // cannot change user name

app.put("/user/:id", async(req, res)=>{

    try {
        const currentUserId = req.params.id;
        console.log(`current user's id: ${currentUserId}`);
        const currentUser = pool.query("SELECT * FROM app_user WHERE user_id = ($1)", [currentUserId])
        .then((user)=>{
            console.log(`Current user's name: ${user.rows[0].user_name}`);
        });
        
       
        const updateUserInfo = req.body;

        const updateInfo = await pool.query("UPDATE app_user SET user_password = crypt($1, gen_salt('md5')), user_phone = $2, user_email = $3 WHERE user_id = $4", [updateUserInfo.user_password, updateUserInfo.user_phone, updateUserInfo.user_email, currentUserId])
        .then((user)=>{
            res.status(200).json(user);
        });
        
    } catch (error) {
        console.error(`Error occured while updating a user info: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }

});

// delete user
app.delete('/user/:id', async(req, res)=>{
    try {   

        // current id
        const currentUserId = req.params.id;
        console.log(`current user's id: ${currentUserId}`);

        const currentUser = pool.query("DELETE FROM app_user WHERE user_id = ($1)", [currentUserId])
        .then((user)=>{
            
            if(user.rowCount == 0){
                console.log(`User is deleted`);
                res.status(200);
            }else{
                console.log(`User hasn't deleted`);
            }
            
        });

        // TODO: User should be logged out.

        
    } catch (error) {
        console.error(`Error occured while deleting a user: ${error.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// create a reservation
    //id = room id
app.post("/reservation/:id", async(req, res)=>{
    try{

        const currentRoomId = req.body.room_id.roomId; //todo: user should click the room and room's id will be in parameter
        const start_date = req.body.start_date.startDate;
        const end_date = req.body.end_date.endDate;
        const stay_days = calculateDays(start_date, end_date);
        const user_id = 1; //todo: need to get a id from cookie?
        let total_price = 0;

        //console.log(start_date.);
        console.log(typeof(start_date));
        console.log(req.body);
        console.log(`Start, end, room id: ${start_date}. ${end_date}, ${currentRoomId}`);

        const newReservation = pool.query(`INSERT INTO reservation (start_date, end_date, room_id, user_id) VALUES(TO_DATE('${start_date}'::text, 'YYYY-MM-DD'), TO_DATE('${end_date}'::text, 'YYYY-MM-DD'), ${currentRoomId}, 1)`)

        let price_per_night = pool.query("SELECT (room_price) FROM room WHERE room_id = $1", [currentRoomId])
        .then((room)=>{
            try {
                if(room.rowCount == 0){
                    console.log(`No room to be matched`);
                }else{
                    price_per_night = room.rows[0].room_price;
                    

                    console.log("total price: ", stay_days * price_per_night);

                    total_price = price_per_night * stay_days;

                    pool.query("UPDATE reservation SET total_price = $1 WHERE room_id = $2", [total_price, currentRoomId]);
                }
            } catch (error) {
                console.log(`Error occured while getting a price per night: ${error.message}`);
            }
        });
    
        res.status(200).json(newReservation);
        
        
    }catch(err){
        console.error(`Error occured while creating a reservation: ${err.message}`);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// calculate stay days
function calculateDays(startDate, endDate){
    let start_date = new Date(startDate);
    let end_date = new Date(endDate);

    let difference_in_time = end_date.getTime() - start_date.getTime();
    let difference_in_days = Math.round(difference_in_time/(1000*3600*24));

    return difference_in_days;
}

// get a list of reservations
    // it show current user's reservations in my-page
    // id in param is user's id
    // todo: getting current user's id from cookie, 
app.get("/reservations/:id", async(req, res)=>{
    try {   

        const currentUserId = req.params.id;
        
        const allReservations = await pool.query("SELECT * FROM reservation r INNER JOIN room rm ON r.room_id = rm.room_id AND user_id = $1", [currentUserId])
        .then((reservations)=>{
            try 
            {
                if(reservations.rowCount != 0){
                    console.log(`${reservations.rowCount} of reservations are selected`);
                    res.status(200).json(reservations.rows);
                }else{
                    console.log(`No reservations`);
                }
                
            } catch (error) {
                console.error(`Error occured while getting all rooms: ${error.message}`)
                return res.status(500).json({ error: 'Internal server error' });
            }
        });

    } catch (error) {
        console.error(`Error occured while getting all rooms: ${error.message}`)
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Get available dates based on selected start/endDate
app.get("/reservations", async(req,res)=>{
    if (req.cookies.token) {
        // 1. validate token
        // if signature is invalid -> throw out, assume not logged in.
        // if valid, extract uid, and assume logged in
        // const loggedInUser = extractUser(req.cookie);
        
    }
    const startDateFromQuery = req.query.startDate;
    const endDateFromQuery = req.query.endDate;

    try {
        // Serach available rooms
        const availableRooms = pool.query(`SELECT * FROM room WHERE room_id NOT IN (SELECT room_id from reservation WHERE start_date >= TO_DATE('${endDateFromQuery}'::text, 'YYYY-MM-DD') AND end_date <= TO_DATE('${startDateFromQuery}'::text, 'YYYY-MM-DD'));`)
        .then((rooms)=>{
            //res.status(200).json(rooms.rows);
            return res.status(200).json(rooms.rows);
        });
        //return availableRooms;
        
    } catch (error) {
        console.error(`Error occured while getting available rooms: ${error.message}`);
    }
});



// delete a reservation
    // user clicks a delete button from a reservation list to delete
    // todo: current logged in user, selected room id
    // id = reservation id
app.delete("/reservation/:id", async(req, res)=>{
    try {
        const currentReservationId = req.params.id;
    
        const deleteReservation = await pool.query("DELETE FROM reservation WHERE reservation_id = $1", [currentReservationId])
        .then((deleted)=>{
            if(deleted.rowCount == 0){
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

// app.listen(PORT, );
