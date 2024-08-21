import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import axios from "axios";

let currentRoom = [];

export default function RoomDetailPage() {

    let [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState([]);


    const roomId = useParams();



    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/')
            .then((res, req) => {

                rooms = res.data;

                for (let i = 0; i < rooms.length; i++) {
                    if (rooms[i]._id === roomId._id) {

                        currentRoom = rooms[i];
                    }
                }

                setLoading(false);
            })
            .catch((err) => {
                res.status(500).json({ error: 'Internal server error' });
                console.log(`Error occured when loading the page: ${err.message}`);
                setLoading(false);
            });
    }, []);

    return (
        //id -> room

        <div>
        <Navbar></Navbar>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">

                <div className="grid grid-cols-1 gap-1 py-3 sm:gap-4">
                    <dd className="text-gray-700 sm:col-span-2"><img src={currentRoom.photo}></img></dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Name</dt>
                    <dd className="text-gray-700 sm:col-span-2">{currentRoom.name}</dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Price</dt>
                    <dd className="text-gray-700 sm:col-span-2">{currentRoom.price}</dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Details</dt>
                    <dd className="text-gray-700 sm:col-span-2">{currentRoom.details}</dd>
                </div>

                <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">Start Date</dt>
                    <dd className="text-gray-700 sm:col-span-2"><input type="date"></input></dd>

                </div><div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="font-medium text-gray-900">End Date</dt>
                    <dd className="text-gray-700 sm:col-span-2"><input type="date"></input></dd>

                </div>

    
                <div className="flex flex-col items-center justify-center">
                    <button type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Green</button>
                </div>
                
     

            </dl>
        </div>
        <Footer></Footer>
        </div>
    )


}