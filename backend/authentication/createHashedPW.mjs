import bcrypt, { compare } from "bcrypt";
import User from "../../backend/models/userModel.cjs";


// Create a hashed password function
const createHashedPW = function (req, res) {
    const salt = 10;
    const saltRounds = 10;
    const userPW = req.body.userPW;
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            console.log('Salt: ', salt);
            return bcrypt.hash(userPW, salt);
        })
        .then(hashedPW => {
            console.log('Hash: ', hashedPW);
            const newUser = new User({
                userID: req.body.userID,
                userPW: hashedPW,
            });
            console.log(`User's pw from body: ${req.body.usePW}`);
            console.log(`User's writing pw : ${newUser}`);
            console.log(`hashed pw: ${hashedPW}`);

            newUser.save();

            return res.status(200).json(newUser);
        })
        .catch(err => console.log(err.message))

}

export default createHashedPW;