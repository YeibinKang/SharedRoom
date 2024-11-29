
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function ReservationDetail() {
    const [open, setOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [userReservations, setUserReservations] = useState([]);
    const [isUpdated, setUpdate] = useState(false);
    const navigation = useNavigate();


    async function getReservationsById(userId) {
        try {
            const response = await fetch(`http://localhost:5173/reservations/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const reservationData = await response.json();
            setUserReservations(reservationData.rows);

        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }

    useEffect(() => {
        const cookieString = document.cookie;
        const currentId = cookieString.split('=')[0];
        getReservationsById(currentId);
    }, []);

    useEffect(() => {
        if (isUpdated) {
            console.log('data has been updated');
            setUpdate(false);
        }
    }, [isUpdated]);

    function getDetails(reservation) {
        setSelectedReservation(reservation);
        setOpen(true);
    }


    async function deleteReservation() {
        if (!selectedReservation) return; // Ensure a reservation is selected
        setOpen(false); // Close the dialog

        const reservationId = selectedReservation.reservation_id;
        try {
            const response = await fetch(`http://localhost:5173/reservation/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            console.log(`is response ok? ${response.ok}`);

            if (response.ok) {
                // Re-fetch reservations after successful deletion
                const cookieString = document.cookie;
                const currentId = cookieString.split('=')[0];
                await getReservationsById(currentId);

                console.log(`Reservation with ID ${reservationId} has been deleted.`);
            }

        } catch (error) {
            console.error(`Error deleting reservation with ID ${reservationId}: ${error.message}`);
        }


    }


    function DateFormatChange({ dateString }) {
        return (
            <div>
                <p className="text-slate-600 leading-normal font-light">{new Date(dateString).toISOString().split('T')[0]}</p>
            </div>
        )
    }

    return (

        <div className="grid gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {userReservations.map((reservation, index) => (
                <div key={index} className="rounded-lg shadow-md bg-white">
                    <img src={reservation.room_photo} alt="Room" className="rounded-t-lg h-48 w-64" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{reservation.room_name}</h3>
                        <p>${reservation.total_price}</p>
                        <p>start date: </p><DateFormatChange dateString={reservation.start_date} />
                        <p>end date: </p><DateFormatChange dateString={reservation.end_date} />
                        <button
                            onClick={() => getDetails(reservation)}
                            className="mt-2 bg-blue-600 text-white py-1 px-3 rounded"
                        >
                            Get details
                        </button>
                    </div>
                </div>
            ))}


            {
                open && selectedReservation && (
                    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
                        />

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                <DialogPanel
                                    transition
                                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                                >
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                                </svg>



                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                                    {selectedReservation.room_name}
                                                </DialogTitle>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Description: {selectedReservation.room_description}
                                                    </p>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Price per night: CAD {selectedReservation.room_price}
                                                    </p>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        {/* todo: add delete the reservation function */}
                                        <button
                                            type="button"
                                            // onClick={deleteReservation(selectedReservation)}
                                            onClick={() => deleteReservation()}
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                        >
                                            Delete the reservation
                                        </button>
                                        <button
                                            type="button"
                                            data-autofocus
                                            onClick={() => setOpen(false)}
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </DialogPanel>
                            </div>

                        </div>

                    </Dialog>
                )
            }

        </div>



    );
}