// Select StartDate, EndDate by using useSate, dates will be saved in DB
// when a user clicks save button, 
// available dates will be shown. by using Fetch()


//fetch 할 때 localhost:// 안 붙인 것
// api call GET 할 때 날짜에 '' 안 붙인 것

import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Calendar() {

    console.log(getCurrentDate());
    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getCurrentDate());
    const [rooms, setRooms] = useState();
    const [selectedRoom, setSelectedRoom] = useState();

    const navigate = useNavigate();

    function getCurrentDate() {
        let yourDate = new Date()
        yourDate.toISOString().split('T')[0]
        const offset = yourDate.getTimezoneOffset();
        yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));
        return yourDate.toISOString().split('T')[0]
    }

    const onChangeStartDate = (e) => {
        const dateValue = e;
        console.log("selected start date: ", dateValue);
        setStartDate(dateValue);
    }

    const onChangeEndDate = (e) => {
        const dateValue = e;
        console.log("selected end date: ", dateValue);
        setEndDate(dateValue);
    }


    async function getAvailableRooms(e) {
        e.preventDefault();

        let availableRooms;
        let availableRoomsJSON;

        try {
            availableRooms = await fetch(`http://localhost:5173/reservations?startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            availableRoomsJSON = await availableRooms.json();

        } catch (error) {
            console.error(`Error occured while getting available rooms: ${error.message}`);

        }
        console.log(availableRoomsJSON);
        setRooms(availableRoomsJSON.rows);
        return availableRoomsJSON.rows;
    }

    // open new window with selected room details
    // pass with start/end date, room information, user info
    async function getRoomDetails() {

        const roomName = selectedRoom;
        let roomInfo;
        let roomInfoJSON;
        let roomFromFetch;

        try {
            roomInfo = await fetch(`http://localhost:5173/room?roomName=${roomName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            roomInfoJSON = await roomInfo.json();

        } catch (error) {
            console.log(`Error occured while geeting room details: ${error.message}`);
        }

        roomFromFetch = roomInfoJSON.rows[0];
        setSelectedRoom(roomFromFetch);
        navigate('/RoomDetailPage', { state: { room_name: roomFromFetch.room_name, room_price: roomFromFetch.room_price, room_description: roomFromFetch.room_description, room_photo: roomFromFetch.room_photo, room_id: roomFromFetch.room_id, start_date: startDate, end_date: endDate } });

    }



    return (

        <div>

            {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

            <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">When do you want to stay?</h1>

                    <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
                        ipsa culpa autem, at itaque nostrum!
                    </p>
                </div>

                <form action="#" className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                    <div>
                        <label htmlFor="date" className="sr-only">Start Date</label>

                        <div className="relative">
                            <label>Select your start date</label>
                            <input
                                type="date" onChange={(e) => onChangeStartDate(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" value={startDate}
                            />

                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="bg-green-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </span>
                        </div>

                    </div>

                    <div>
                        <label htmlFor="date" className="sr-only">End Date</label>

                        <div className="relative">
                            <label>Select your end date</label>
                            <input
                                type="date" onChange={(e) => onChangeEndDate(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm" value={endDate}
                            />

                            <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="size-4 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="bg-green-500"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                    />
                                </svg>
                            </span>



                        </div>
                    </div>


                    <div className="flex items-center justify-between">

                        <button
                            type="submit" onClick={getAvailableRooms}
                            className="inline-block rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Search
                        </button>
                    </div>


                </form>

                <br></br>


                <div className="flex flex-row gap-4">
                    {rooms?.map((room, index) => {
                        return <div key={room._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <img className="rounded-t-lg object-cover h-48 w-96" src={room.room_photo} ></img>
                            <div className="p-5">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" id="tdRoomId">{room.room_name}</h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">$ {room.room_price} per night</p>
                            </div>


                            <div className="align-content:space-between;">
                                <input id="checkbox" type="checkbox" onChange={() => setSelectedRoom(room.room_name)} checked={selectedRoom === room.room_name} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        </div>
                    })}
                </div>




                {/* todo: room detail's table and Get Details button wouldn't be shown before clicking Search
                            should i hide Calendar part after clicking Search button? */}
                <div className="flex items-center justify-between">

                    <button
                        type="submit" onClick={getRoomDetails}
                        className="inline-block rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white"
                    >
                        Get Details
                    </button>
                </div>



            </div>
        </div >
    );
}