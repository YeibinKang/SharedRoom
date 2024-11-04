import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReservationDetail() {

    var reservations;
    var user;
    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];
    const navigate = useNavigate();

    //user

    const [userReservations, setUserReservations] = useState();


    async function getReservationsById(userId) {
        try {
            reservations = await fetch(`http://localhost:5173/reservations/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let reservationJSON = await reservations.json();
            console.log(reservationJSON);
        } catch (error) {
            console.log(`Error occured while getting a list of reservation with user id ${currentId}, ${error.message}`);

        }
    }

    //get user's reservation information
    async function getReservations() {
        //fetch a list of reservations
        let reservations;
        try {
            reservations = await getReservationsById(currentId);
        } catch (error) {
            console.log(`Error occured while getting a list of reservations with user id ${currentId}, ${error.message}`);
        }

        setUserReservations(reservations);


    }
    console.log(reservations);
    getReservations();


    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

            <div className="flex flex-row gap-4">
                {userReservations?.map((reservation, index) => {
                    return <div key={reservation._id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                        {/* <img className="rounded-t-lg object-cover h-48 w-96" src={reservation.total_price} ></img> */}
                        <div className="p-5">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white" id="tdRoomId">{reservation.total_price}</h5>
                            {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">$ {room.room_price} per night</p> */}
                        </div>

                    </div>
                })}
            </div>
        </div>
    )
}