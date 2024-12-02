import { useEffect, useState } from "react";


export default function UserDetail() {

    var user;
    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];

    //user
    const [userName, setUserName] = useState();
    const [userPassword, setUserPassword] = useState();
    const [userPhone, setUserPhone] = useState();
    const [userEmail, setUserEmail] = useState();
    const [newPw, setNewPw] = useState();


    async function getUserById(userId) {
        console.log(`current id from userDetail page: ${currentId}`);
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
    async function getUserInfo() {
        //fetch user's information
        let userInfo;
        try {
            userInfo = await getUserById(currentId);
        } catch (error) {
            console.log(`Error occured while getting a user's information with user id ${currentId}, ${error.message}`);
        }

        setUserName(userInfo.rows[0].user_name);
        setUserPassword(userInfo.rows[0].user_password);
        setUserPhone(userInfo.rows[0].user_phone);
        setUserEmail(userInfo.rows[0].user_email);

    }

    // todo: update button function
    // getting a value from the form
    async function updateUserInfo(event) {
        event.preventDefault();
        console.log('submit clicked!');
        console.log(newPw);

        try {
            const response = await fetch(`http://localhost:5173/user/${currentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPw: newPw }),

            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            console.log("Update successful:", data);
            return data;

        } catch (error) {
            console.log(`Error occured while updating a user's information with user id ${currentId}, ${error.message}`);
        }

    }



    //run a function to get user's detail information
    useEffect(() => {
        (async () => {
            await getUserInfo();
        })();
    }, []);




    return (
        <div className="grid gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">




            <form onSubmit={updateUserInfo} className="max-w-screen-xl" >
                <div>
                    <label htmlFor="name" >User Name</label>
                    <div className="relative">
                        <input
                            type="name" name="user_name"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder={userName} disabled="disabled"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password">Password</label>

                    <div className="relative">
                        <input
                            type="password" name="user_password"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder={userPassword} onChange={(e) => setNewPw(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email">User Email</label>

                    <div className="relative">
                        <input
                            type="email" name="user_email"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder={userEmail} disabled="disabled"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="number">Phone number</label>

                    <div className="relative">
                        <input
                            type="tel" name="user_phone"
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                            placeholder={userPhone} disabled="disabled"
                        />


                    </div>
                </div>



                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                    >
                        Save
                    </button>
                </div>

            </form>



        </div>
    )
}