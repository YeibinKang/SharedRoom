import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ReservationDetail() {

    var response;
    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];
    const navigate = useNavigate();

    //user

    const [userReservations, setUserReservations] = useState();


    async function getReservationsById(userId) {
        try {
            response = await fetch(`http://localhost:5173/reservations/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const reservationData = await response.json();
            //const reservationRows = response.json();

            setUserReservations(reservationData.rows);

            //console.log(`user's reservations: ${JSON.stringify(userReservations)}`);

            //console.log(`user's ${userReservations.rows[0]}`);
        } catch (error) {
            console.log(`Error occured while getting a list of reservation with user id ${currentId}, ${error.message}`);

        }

    }

    function DateFormatChange({ dateString }) {
        return (
            <div>
                <p className="text-slate-600 leading-normal font-light">{new Date(dateString).toISOString().split('T')[0]}</p>
            </div>
        )
    }

    // Use useEffect to trigger the data fetch on component mount
    useEffect(() => {
        getReservationsById(currentId);
    }, [currentId]);


    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
            {/* Render reservation details or a loading message */}



            <div className="relative my-6 bg-white shadow-sm rounded-lg">
                <div className="grid gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userReservations?.map((reservation, index) => {
                        return (
                            <div key={reservation._id || index} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full max-w-xs mx-auto">
                                <div className="relative p-2.5 h-96 overflow-hidden rounded-xl bg-clip-border">
                                    <img src={reservation.room_photo} alt="card-image" className="h-full w-full object-cover rounded-md" />
                                </div>

                                <div className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-slate-800 text-xl font-semibold">
                                            {reservation.room_name}
                                        </p>
                                        <p className="text-cyan-600 text-xl font-semibold">
                                            ${reservation.total_price}
                                        </p>
                                    </div>

                                    <p>start date: </p><DateFormatChange dateString={reservation.start_date} />
                                    <p>end date: </p><DateFormatChange dateString={reservation.end_date} />

                                    <button className="rounded-md w-full mt-6 bg-cyan-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                        Get details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    )
}