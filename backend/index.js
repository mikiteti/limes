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

const validate_email = (email) => String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

const errors = [
    { id: 0, name: "A felhasználó nem található." },
    { id: 1, name: "Nem megfelelő jelszó. Jelenkezz be újra manuálisan." },
    { id: 2, name: "A fájl nem található." },
    { id: 3, name: "Hozzáférés megtagadva." },
    { id: 4, name: "A jeszavak nem egyeznek." },
    { id: 5, name: "Ez az email cím már foglalt." },
    { id: 6, name: "Helytelen email."},
];

const get_file = (body, res) => {
    authenticate_user(body.user_id, body.password, res, () => {
        res.json("Success: user identified.");
    });
}

const new_file = (body, res) => {

}

const register_action = (body, res) => {

}

const close_file = (body, res) => {

}

const update_tag = (body, res) => {

}

const create_profile = (body, res) => {
    const { email, name, password, theme } = body;

    if (!validate_email(email)) {
        console.error({error: errors[6]});
        res.json({error: errors[6]});
        return;
    }

    tm.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) console.error(err.message);
        if (user) {
            console.log({error:errors[5]});
            res.json({error:errors[5]});
            return;
        }

        tm.run("INSERT INTO users (name, email, password, theme) VALUES (?, ?, ?, ?)", [name, email, password, theme], (err2) => {
            if (err2) console.error(err2.message);

            tm.get("SELECT * FROM users WHERE email = ?", [email], (err3, user2) => {
                if (err3) console.error(err3.message);

                user2.success = "Felhasználó létrehozva";
                res.json(user2);
            });
        });
    });
}

const login = (body, res) => {
    const { identifier, password } = body;
    
    tm.get("SELECT * FROM users WHERE " + (typeof identifier == "string" ? "email" : "id") + " = ?", [identifier], (err, user) => {
        if (err) console.error(err.message);

        if (user == undefined) {
            console.error({error: errors[0]});
            res.json({error: errors[0]});
            return;
        }

        if (user.password != password) {
            console.error({error: errors[1]});
            res.json({error: errors[1]});
            return;
        }

        res.json(user);
    });
}

const delete_profile = (body, res) => {
    const { identifier, password } = body;
    
    if (typeof identifier == "string" && !validate_email(identifier)) {
        console.error({error: errors[6]});
        res.json({error: errors[6]});
        return;
    }

    tm.get("SELECT * FROM users WHERE " + (typeof identifier == "string" ? "email" : "id") + " = ?", [identifier], (err, user) => {
        if (err) console.error(err.message);

        if (user == undefined) {
            console.error({error: errors[0]});
            res.json({error: errors[0]});
            return;
        }

        if (user.password != password) {
            console.error({error: errors[1]});
            res.json({error: errors[1]});
            return;
        }

        tm.run("DELETE FROM users WHERE " + (typeof identifier == "string" ? "email" : "id") + " = ?", [identifier], (err2) => {
            if (err2) console.error(err2.message);

            res.json({success: "Felhasználó törölve"});
        });
    });
}

const endpoints = {
    create_profile: create_profile,
    login: login,
    delete_profile: delete_profile,
    get_file: get_file,
    new_file: new_file, 
    close_file: close_file,
    register_action: register_action,
}

app.post("/request", (req, res) => {
    const { api_name, body } = req.body;

    endpoints[api_name](body, res);
});

app.listen(2517, (err) => {
    if (err) console.error(err.message);
    console.log("App listening on port 2517");
});
