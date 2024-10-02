const Pool = require("pg").Pool;



const pool = new Pool({
    user:"postgres",
    password:"password",
    host:"localhost",
    port:5433,
    database:"sharedrooms"
});

module.exports = pool;