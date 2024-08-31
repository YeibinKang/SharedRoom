import bcrypt, { compare } from "bcrypt";
import pool from "../db.cjs";

// Create a hashed password function
const createHashedPW = function (user_id, user_password) {
    const salt = 10;
    const saltRounds = 10;

    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            console.log('Salt: ', salt);
            return bcrypt.hash(user_password, salt);
        })
        .then(hashedPW => {
            console.log('Hash: ', hashedPW);
            //TODO: Update user's pw with hashed version
            //const newPW = pool.query("INSERT INTO app_user (user_name, user_password, user_phone, user_email) VALUES ($1, $2, $3, $4)", []);
            
            const updatedPW = pool.query("UPDATE app_user SET user_password = $1 WHERE user_id = $2", [hashedPW, user_id]);
            console.log(`updated : `);

            //return res.status(200).json(updatedPW);

          
        })
        .catch(err => console.log(err.message))

}

export default createHashedPW;