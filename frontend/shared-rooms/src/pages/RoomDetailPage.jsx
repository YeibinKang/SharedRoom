
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

export default function RoomDetailPage() {

    const location = useLocation();
    const roomName = location.state.room_name;
    const roomPrice = location.state.room_price;
    const roomDescription = location.state.room_description;
    const roomPhoto = location.state.room_photo;
    const roomId = location.state.room_id;
    const startDate = location.state.start_date;
    const endDate = location.state.end_date;
    const stayDays = calculateDays(startDate, endDate);
    const userIdFromCookie = document.cookie;
    const currentUserId = parseInt(userIdFromCookie.split('=')[0]);
    //const {roomName, roomPrice} = state;
    const navigate = useNavigate();

    function calculateDays(startDate, endDate) {
        let start_date = new Date(startDate);
        let end_date = new Date(endDate);

        let difference_in_time = end_date.getTime() - start_date.getTime();
        let difference_in_days = Math.round(difference_in_time / (1000 * 3600 * 24));

        return difference_in_days;
    }

    function getTotalPrice() {
        let days = calculateDays(startDate, endDate);
        let totalprice = roomPrice * days;
        return totalprice;

    }

    // todo: before booking, user should be logged


    //make a reservation
    async function bookRoom() {
        //room id 

        let sendReservationJSON;

        //user Validation
        if (!currentUserId) {
            console.error('User should log in before booking');
        }

        try {
            let sendReservation = await fetch(`http://localhost:5173/reservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    start_date: { startDate },
                    end_date: { endDate },
                    room_id: { roomId },
                    user_id: { currentUserId }
                })
            });
            sendReservationJSON = await sendReservation.json();

        } catch (error) {
            console.log(`Error occured while making a reservation: ${error.message}`);
        }

        console.log(sendReservationJSON.rows);
        alert("Booking is done!");
        navigate('/');


    }



    return (
        <div>
            <Navbar></Navbar>

            <div className="bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/2 px-4 mb-8">
                            <img src={roomPhoto} alt="room image"
                                className="w-full h-auto rounded-lg shadow-md mb-4" id="mainImage" />
                        </div>


                        <div className="w-full md:w-1/2 px-4">
                            <h2 className="text-3xl font-bold mb-2">Stay from {startDate} to {endDate}</h2>
                            <h2 className="text-3xl font-bold mb-2">{roomName}</h2>
                            <div className="mb-4">
                                <span className="text-2xl font-bold mr-2">$ {getTotalPrice()}</span>
                            </div>
                            <div className="mb-3">
                                <span className="text-1xl font-bold mr-2">$ {roomPrice} *  {stayDays}days</span>
                            </div>



                            <div>
                                <h3 className="text-lg font-semibold mb-2">Room Details:</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>{roomDescription}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">

                        <button
                            type="submit" onClick={bookRoom}
                            className="inline-block rounded-lg bg-green-500 px-5 py-3 text-sm font-medium text-white">
                            Book!
                        </button>
                    </div>
                </div>



            </div>




            <Footer></Footer>
        </div>
    )


}