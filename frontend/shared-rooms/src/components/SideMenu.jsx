import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDetail from "./userDetail";
import ReservationDetail from "./reservationDetail";




export default function SideMenu() {

    var reservations;
    var user;
    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];
    const navigate = useNavigate();

    //user
    const [userId, setUserId] = useState();
    const [userName, setUserName] = useState();
    const [userPassword, setUserPassword] = useState();
    const [userPhone, setUserPhone] = useState();
    const [userEmail, setUserEmail] = useState();

    const [userReservations, setUserReservations] = useState();

    const [showUserDetail, setShowUserDetail] = useState(false);
    const [reservationShow, setReservationShow] = useState(false);


    async function getReservationsById(userId) {
        try {
            reservations = await fetch(`http://localhost:5174/reservations/${userId}`, {
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




    async function getUserById(userId) {
        try {
            user = await fetch(`http://localhost:5174/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let userJSON = await user.json();
            return userJSON;

        } catch (error) {
            console.log(`Error occured while getting a user's information with user id ${currentId}, ${error.message}`);
        }
    }

    //get user's information
    async function getUserInfo() {

        setShowUserDetail(true);
        setReservationShow(false);
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

    function logOut() {
        Cookies.remove(currentId);
        alert('Logged out!');
        navigate('/');
        window.location.reload();
    }

    function onShow() {
        setReservationShow(true);
        setShowUserDetail(false);
        console.log(reservationShow);
    }
    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

            <div className="w-32 h-64 bg-gray-100 h-screen">

                <ul className="mt-6 space-y-1">

                    <li>
                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary
                                className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                <span className="text-sm font-medium"> Account </span>

                                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="size-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </summary>

                            <ul className="mt-2 space-y-1 px-4">
                                <li>

                                    <button onClick={getUserInfo}
                                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Details
                                    </button>
                                </li>



                                <li>
                                    <form action="">
                                        <button
                                            onClick={logOut}
                                            className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </form>
                                </li>
                            </ul>
                        </details>
                    </li>

                    <li>
                        <button
                            onClick={onShow}
                            className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                            Reservations
                        </button>

                    </li>

                </ul>



            </div>



            {showUserDetail ? (<UserDetail />) : (<h1></h1>)}
            {reservationShow ? (<ReservationDetail />) : (<h1></h1>)}




        </div >


    )

}

