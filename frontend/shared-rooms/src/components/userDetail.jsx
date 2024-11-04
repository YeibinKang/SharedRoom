import { useState } from "react";

export default function UserDetail() {

    var user;
    var cookieString = document.cookie;
    var currentId = cookieString.split('=')[0];

    //user
    const [userName, setUserName] = useState();
    const [userPassword, setUserPassword] = useState();
    const [userPhone, setUserPhone] = useState();
    const [userEmail, setUserEmail] = useState();


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


        console.log(userInfo);
        console.log(userInfo.rows[0].user_id);

        setUserName(userInfo.rows[0].user_name);
        setUserPassword(userInfo.rows[0].user_password);
        setUserPhone(userInfo.rows[0].user_phone);
        setUserEmail(userInfo.rows[0].user_email);

    }

    // todo: update button function
    // getting a value from 
    function updateUserInfo() {
        console.log('submit clicked!');
    }



    //run a function to get user's detail information
    getUserInfo();



    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

            <div className="pl-30">


                <form onSubmit={updateUserInfo} className="max-w-screen-xl" >
                    <div>
                        <label htmlFor="name" >User Name</label>
                        <div className="relative">
                            <input
                                type="name" name="user_name"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder={userName}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>

                        <div className="relative">
                            <input
                                type="password" name="user_password"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder={userPassword}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email">User Email</label>

                        <div className="relative">
                            <input
                                type="email" name="user_email"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder={userEmail}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="number">Phone number</label>

                        <div className="relative">
                            <input
                                type="tel" name="user_phone"
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder={userPhone}
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

        </div>
    )
}