
import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { useLocation } from "react-router-dom";

export default function RoomDetailPage() {

    const location = useLocation();
    const roomName = location.state.room_name;
    const roomPrice = location.state.room_price;
    const roomDescription = location.state.room_description;
    const roomPhoto = location.state.room_photo;
    const roomId = location.state.room_id;
    //const {roomName, roomPrice} = state;


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
                            <h2 className="text-3xl font-bold mb-2">{roomName}</h2>
                            <div className="mb-4">
                                <span className="text-2xl font-bold mr-2">${roomPrice}</span>
                            </div>
                            
                            <p className="text-gray-700 mb-6">{roomDescription}</p>

                            <div className="mb-6">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                                <input type="number" id="quantity" name="quantity" min="1" value="1" className="w-12 text-center rounded-md border-gray-300  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
                                <ul className="list-disc list-inside text-gray-700">
                                    <li>Industry-leading noise cancellation</li>
                                    <li>30-hour battery life</li>
                                    <li>Touch sensor controls</li>
                                    <li>Speak-to-chat technology</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>




            <Footer></Footer>
        </div>
    )


}