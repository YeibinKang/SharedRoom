import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Register() {
    
    //todo: need to create functions to handle creating user
        // when click Sign up button
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userEmail, setUserEmail] = useState("");

    console.log(typeof(userEmail));

    const handleUserName = (e)=>{
        setUserName(e.target.value);
    }

    const handleUserPassword = (e) => {
        setUserPassword(e.target.value);
    }
    
    const handleUserPhone = (e) =>{
        setUserPhone(e.target.value);
    }

    const handleUserEmail = (e) => {
        setUserEmail(e.target.value);
        console.log(userEmail);
    }

    async function handleCreateUser(e){

        e.preventDefault();
        e.stopPropagation();
       
        console.log(userEmail, userName, userPassword, userPhone);

        try {
            const createUser = await fetch(`/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_name:userName,
                    user_password:userPassword,
                    user_phone:userPhone,
                    user_email:userEmail,
                })
            });

        } catch (error) {
            console.log(`Error occured while registering a user: ${error.message}`);
        }

        // fetch(`/user`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         user_name:userName,
        //         user_password:userPassword,
        //         user_phone:userPhone,
        //         user_email:userEmail,
        //     })
        // })
        //     .then((res) => {
        //         return res.json().then((data) => {
        //             console.log(data);
                    
        //         }).catch((err) => {
        //             console.log(err.message);
        //         })
        //     });
               
        navigate('/');


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
                    <h1 className="text-2xl font-bold sm:text-3xl">Get started today!</h1>

                    <p className="mt-4 text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Et libero nulla eaque error neque
                        ipsa culpa autem, at itaque nostrum!
                    </p>
                </div>

                <form action="#" className="mx-auto mb-0 mt-8 max-w-md space-y-4" onSubmit={handleCreateUser}>
                    <div>
                        <label htmlFor="name" className="sr-only">User Name</label>

                        <div className="relative">
                            <input
                                type="name" name="user_name" onChange={handleUserName}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter user name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>

                        <div className="relative">
                            <input
                                type="password" name="user_password" onChange={handleUserPassword}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="sr-only">User Email</label>

                        <div className="relative">
                            <input
                                type="email" name="user_email" onChange={handleUserEmail}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter user email"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="number" className="sr-only">Phone number</label>

                        <div className="relative">
                            <input
                                type="tel" name="user_phone" onChange={handleUserPhone}
                                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                                placeholder="Enter your phone number"
                            />

   
                        </div>
                    </div>

                    

                    <div className="flex items-center justify-between">
                        <button
                            type="submit" 
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}