const express = require("express");
const app = express();
const cors = require("cors");
const sqlite = require("sqlite3").verbose();
const tm = new sqlite.Database("db/tm.db", sqlite.OPEN_READWRITE, (err) => { if (err) console.error(err.message); console.log("Connected to database tm."); });
const limes = new sqlite.Database("db/limes.db", sqlite.OPEN_READWRITE, (err) => { if (err) console.error(err.message); console.log("Connected to database limes.") });

app.use(cors(), express.json({ limit: "10gb" }));

const authenticate_user = (id, password, res, callback) => {
    tm.get("SELECT password FROM users WHERE id = ?", [id], (err, user) => {
        if (err) console.error(err.message);
        if (user == undefined) {
            console.log({ error: errors[0] });
            res.json({ error: errors[0] });
            return;
        }
        if (user.password != password) {
            console.log({ error: errors[1] });
            res.json({ error: errors[1] });
            return;
        }

        callback();
    });
};

const errors = [
    { id: 0, name: "A felhasználó nem található." },
    { id: 1, name: "Nem megfelelő jelszó. Jelenkezz be újra manuálisan." },
    { id: 2, name: "A fájl nem található." },
    { id: 3, name: "Hozzáférés megtagadva." },
    { id: 4, name: "A jeszavak nem egyeznek." },
    { id: 5, name: "Ez az email cím már foglalt." },
];

const get_file = (body, res) => {
    authenticate_user(body.user_id, body.password, res, () => {
        res.json("Success: user identified.");
    });
}

const new_file = (body, res) => {

}

const close_file = (body, res) => {

}

const register_action = (body, res) => {

}

const login = (body, res) => {

}

const create_profile = (body, res) => {

}

const update_tag = (body, res) => {

}

const get_user_data = (body, res) => {

}

const endpoints = {
    get_file: get_file,
    new_file: new_file, 
    close_file: close_file,
    register_action: register_action,
    // ...
}

app.post("/request", (req, res) => {
    const { api_name, body } = req.body;

    endpoints[api_name](body, res);
});

app.listen(2517, (err) => {
    if (err) console.error(err.message);
    console.log("App listening on port 2517");
});
