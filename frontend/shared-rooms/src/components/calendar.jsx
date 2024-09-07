// Select StartDate, EndDate by using useSate, dates will be saved in DB
// when a user clicks save button, 
// available dates will be shown. by using Fetch()


//fetch 할 때 localhost:// 안 붙인 것
// api call GET 할 때 날짜에 '' 안 붙인 것

import { useState } from "react";

let availableRooms = [];

export default function Calendar() {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();


    const onChangeStartDate = (e) => {

        const dateValue = e;
        console.log("selected date: ", dateValue);
        setStartDate(dateValue);
        console.log("date value's data type: ", typeof (dateValue));

    }

    const onChangeEndDate = (e) => {
        const dateValue = e;
        console.log("selected end date: ", dateValue);
        setEndDate(dateValue);
    }

    //todo: using useState for saving data
    function getAvailableRooms() {

        fetch(`http://localhost:5555/reservations?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => {
                
                console.log(data);

                //todo: render rooms in screen
                    //should do it globally...
                const rooms = data.map((room) =>

                    <li key={room.room_id}>
                        <li>{room.room_name}</li>
                        <li>{room.room_price}</li>
                        <li>{room.room_description}</li>
                    </li>
                )
                
                return (
                    <div>
                        <ul>{rooms}</ul>
                    </div>
                    
                );

            });

            

            
            console.log(`this: ${availableRooms}`);

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
                            <lable>Select your start date</lable>
                            <input
                                type="date" onChange={(e) => onChangeStartDate(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
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
                            <lable>Select your end date</lable>
                            <input
                                type="date" onChange={(e) => onChangeEndDate(e.target.value)}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
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

                {/* todo: show a list of rooms */}
                <ul>
                    <li>{availableRooms.room_name}</li>
                </ul>



            </div>
        </div>
    );
}