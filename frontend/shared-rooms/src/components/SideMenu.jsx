import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



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


    async function getReservationsById(userId) {
        try {
            reservations = await fetch(`http://localhost:5173/MyPage/${userId}`, {
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
            user = await fetch(`http://localhost:5173/user/${userId}`, {
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
    async function getUser() {
        //fetch user's information
        const userInfo = await getUserById(currentId);


        console.log(userInfo);
        console.log(userInfo.rows[0].user_id);

        setUserId(userInfo.rows[0].user_id);
        setUserName(userInfo.rows[0].user_name);
        setUserPassword(userInfo.rows[0].user_password);
        setUserPhone(userInfo.rows[0].user_phone);
        setUserEmail(userInfo.rows[0].user_email);

        //display user's information (editable status)
        //create a save button

    }


    //get user's reservation information
    async function getReservations() {
        //fetch a list of reservations
        getReservationsById(currentId);

    }

    function logOut() {
        Cookies.remove(currentId);
        alert('Logged out!');
        navigate('/');
        window.location.reload();
    }

    return (
        <div className="flex h-screen justify-between border-e bg-white">
            <div className="px-4 py-6">

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

                                    <button onClick={getUser}
                                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                                        Details
                                    </button>
                                </li>


                                <li>
                                    <form action="#">
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
                        <a
                            href="#"
                            className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                        >
                            Reservation
                        </a>
                    </li>

                </ul>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
                <a href="#" className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                    <img
                        alt=""
                        src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                        className="size-10 rounded-full object-cover"
                    />

                    <div>
                        {/* todo: add user's information */}
                        <p className="text-xs">
                            <strong className="block font-medium">Eric Frusciante</strong>

                            <span> eric@frusciante.com </span>
                        </p>
                    </div>
                </a>
            </div>
        </div>
    )

}

