const boring = require("./boring");

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
            console.error({ error: errors[0] });
            res.json({ error: errors[0] });
            return;
        }
        if (user.password != password) {
            console.error({ error: errors[1] });
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
    { id: 7, name: "A változtatni próbált beállítás nem található vagy nem változtatható."},
    { id: 8, name: "A változtatni próbált adat nem található vagy nem változtatható."},
];

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
            console.error({error:errors[5]});
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

        limes.all("SELECT * FROM tags WHERE author = ?", [user.id], (err2, tags) => {
            if (err2) console.error(err2.message);

            tags.forEach(tag => tag.resultants = boring.decrypt_array(tag.resultants));
            user.limes = {tags: tags};

            user.success = "Bejelentkezés sikeres";
            res.json(user);
        });
    });
}

const delete_profile = (body, res) => {
    const { id, password } = body;
    
    tm.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
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

        tm.run("DELETE FROM users WHERE id = ?", [id], (err2) => {
            if (err2) console.error(err2.message);

            res.json({success: "Felhasználó törölve"});
        });
    });
}

const set_user_property = (body, res) => {
    const { id, password, properties } = body;

    if (!boring.validate_properties(properties)) {
        console.error({error: errors[7]});
        res.json({error: errors[7]});
        return;
    }

    authenticate_user(id, password, res, () => {
        tm.run("UPDATE users SET " + Object.getOwnPropertyNames(properties).map(property => property + (typeof properties[property] == "string" ? " = \"" : " = ") + String(properties[property]) + (typeof properties[property] == "string" ? "\"" : "")).toString() + " WHERE id = ?", [id], (err) => {
            if (err) console.error(err.message);

            res.json({success: "Beállítás megváltoztatva."})
        });
    });
}

const get_previews = (body, res) => {
    const { user_id, password, current_previews } = body;

    authenticate_user(user_id, password, res, () => {
        limes.all('SELECT id, preview, preview_last_changed, authors, name, last_modified, creation_date, tags, creator, size FROM files WHERE authors LIKE "%,' + user_id + ',%"', (err, previews) => {
            if (err) console.error(err.message);

            const response = { success: "Előnézetek sikeresen lekérve", previews: [] };
            for (const preview of previews) {
                const current_preview = current_previews.find(p => p.id == preview.id);
                if (current_preview && current_preview.last_changed == preview.preview_last_changed) continue;

                preview.authors = boring.decrypt_array(preview.authors);
                preview.tags = boring.decrypt_array(preview.tags);
                response.previews.push(preview);
            }

            res.json(response);
        });
    });
}

const get_file = (body, res) => {
    const { user_id, password, file_id } = body;

    authenticate_user(user_id, password, res, () => {
        limes.get("SELECT content, authors, acted_out FROM files WHERE id = ?", [file_id], (err, file) => {
            if (err) console.error(err.message);

            if (boring.decrypt_array(file.authors).indexOf(user_id) == -1) {
                console.error({error:errors[3]});
                res.json({error:errors[3]});
                return;
            }

            if (!file.acted_out) {
                act_out(file_id, callback);
                return;
            }

            file.authors;
            delete file.acted_out;
            file.content = JSON.parse(file.content);
            file.success = "Fájl sikeresen lekérve";
            res.json(file);
        });
    });
}

const set_file_data = (body, res) => {
    const { user_id, password, file_id, data } = body;

    if (!boring.validate_data(data)) {
        console.error({error: errors[8]});
        res.json({error: errors[8]});
        return;
    }

    authenticate_user(user_id, password, res, () => {
        limes.get("SELECT authors FROM files WHERE id = ?", [file_id], (err, file) => {
            if (err) console.error(err.message);

            if (boring.decrypt_array(file.authors).indexOf(user_id) == -1) {
                console.error({error:errors[3]});
                res.json({error:errors[3]});
                return;
            }

            limes.run("UPDATE users SET " + Object.getOwnPropertyNames(data).map(name => name + (typeof data[name] == "string" ? " = \"" : " = ") + String(data[name]) + (typeof data[name] == "string" ? "\"" : "")).toString() + " WHERE id = ?", [id], (err2) => {
                if (err2) console.error(err.message);

                res.json({success: "Fájladat átírva"});
            });
        });
    });
}

const endpoints = {
    create_profile: create_profile,
    login: login,
    delete_profile: delete_profile,
    set_user_property: set_user_property,
    get_previews: get_previews,
    get_file: get_file,
    set_file_data: set_file_data,
}

app.post("/request", (req, res) => {
    const { api_name, body } = req.body;

    endpoints[api_name](body, res);
});

app.listen(2517, (err) => {
    if (err) console.error(err.message);
    console.log("App listening on port 2517");
});
