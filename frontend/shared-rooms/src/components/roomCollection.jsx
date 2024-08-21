import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";



export default function RoomCollection() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState([]);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:5555/')
            .then((res) => {
                setRooms(res.data); 
                console.log(`The first room is : ${rooms[0]}`)
                console.log(`${res.data.length} of rooms are fetched: `)
                setLoading(false);
            })
            .catch((err) => {
                //res.status(500).json({ error: 'Internal server error' });
                console.log(`Error occured when loading the page: ${err.message}`);
                setLoading(false);
            });
    }, []);

    return (

        // <div>
        //     <section>
        //         <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        //             <header className="text-center">
        //                 <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Rooms Collection</h2>

        //                 <p className="mx-auto mt-4 max-w-md text-gray-500">
        //                     Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque praesentium cumque iure
        //                     dicta incidunt est ipsam, officia dolor fugit natus?
        //                 </p>
        //             </header>

        //             <div className="overflow-x-auto">
        //                 <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
        //                     <thead className="ltr:text-left rtl:text-right">
        //                         {/* <tr>
        //                         <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
        //                         <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Price</th>
        //                         <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Details</th>
        //                         <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Photo</th>
        //                     </tr> */}
        //                     </thead>
        //                     <tbody className="divide-y divide-gray-200">


        //                         {rooms?.map((room, index) => {
        //                             return <tr key={room._id}>
        //                                 <td className="whitespace-nowrap px-4 py-2 text-gray-700 object-scale-down"><img src={room.photo} ></img></td>
        //                                 <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{room.name}</td>
        //                                 <td className="whitespace-nowrap px-4 py-2 text-gray-700">{room.price}</td>
        //                                 <td className="whitespace-nowrap px-4 py-2 text-gray-700">{room.details}</td>

        //                             </tr>
        //                         })}
        //                     </tbody>
        //                 </table>
        //             </div>




        //         </div>
        //     </section>
        // </div>

        <div>
            <header className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-lg text-center">
                    <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

                    <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
                        ipsa culpa autem, at itaque nostrum!
                    </p>
                </div>
            </header>
            <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 columns-2">
            {rooms?.map((room, index) => {
                return (
                    // <section>
                    
                            <ul className="mt-8 grid gap-4">
                                <li key={room._id}>
                                    <a href={"/RoomDetailPage/"+room._id} className="group block overflow-hidden">
                                        <img
                                            src={room.photo}
                                            alt=""
                                            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
                                        />

                                        <div className="relative bg-white pt-3">
                                            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                                                {room.name}
                                            </h3>

                                            <p className="mt-2">
                                                <span className="sr-only"> {room.details} </span>
                                                <span className="tracking-wider text-gray-900"> CAD {room.price} </span>
                                            </p>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        
                    



                )
                
            })}
            </div>
            </section>
        </div>
    )
}