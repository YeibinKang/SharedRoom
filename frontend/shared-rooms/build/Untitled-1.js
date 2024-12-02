
async function f() {
    const value = await pool.query();
    try {
        const v2 = await pool.query("seelect 1 from $1", value1);
    } catch (err) {
        return err;
    }
    return v2;
}

function f2() {
    f()
    .then((v) => {console.log(v)});

    pool.query("...").then((value) => {
        if (value) {
            return Promise.resolve(value);
        } else {
            return Promise.reject(new Error("value is not good"));
        }
    })
    .then((value1) => {
        return pool.query("seelect 1 from $1", value1);
    })
    .catch((err) => {
        console.error("Error was " + err);
    });
}


async function f3() {
    const promise1 = pool.query("");
    const promise2 = pool.query("");
    const promise3 = pool.query("");
    Promise.all([promise1, promise2, promise3])
    .then((a, b, c) => {...});
    console.log("1");


    const result1 = await pool.query("");
    const result2 = await pool.query("");
    const result3 = await pool.query("");
    // await Promise.all([promise1, promise2, promise3]);
    console.log("1");
}


async function foo(){
    const result1 = await new Promise((resolve)=>setTimeout(()=>resolve("1")),);
    const result2 = await new Promise((resolve)=>setTimeout(()=>resolve("2")),);
}

foo();


// promise style
app.get("/rooms1", (req, res) => {
    // pool.query("SELECT * FROM room")
    //     .then((allRooms) => {
    //         res.status(200).json(allRooms.rows);
    //     })
    //     .catch((error) => {
    //         console.error(`Error occured while getting all rooms: ${error.message}`)
    //         res.status(500).json({ error: 'Internal server error' });
    //     });
    setTimeout(() => {res.status(200).json({test:1})}, 3000);
});