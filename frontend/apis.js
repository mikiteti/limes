const source = "http://localhost:2517";
// const source = "https://tetimiki.hu/notes";

const apis = {
    request (json) {
        json.random = Math.random();
        console.log("Sending request: ", json.api_name);
        return fetch(source+"/request", { cache: "no-store", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) }).then(res => res.json());
    },

    async create_profile (email, name, password) {
       return await this.request({
           api_name: "create_profile",
           body: {
               email: email,
               name: name,
               password: password,
               theme: ui.current_theme,
           }
       })
    },

    async login (identifier, password) {
        return await this.request({
            api_name: "login",
            body: {
                identifier: identifier,
                password: password,
            }
        });
    },

    async delete_profile (id = status.current_user.id, password = status.current_user.password) {
        return await this.request({
            api_name: "delete_profile",
            body: {
                id: id,
                password: password,
            }
        });
    },

    async get_previews(id = status.current_user.id, password = status.current_user.password, previews = local.limes.previews.map(preview => {return {id: preview.id, last_changed: preview.preview_last_changed}})) {
        return await this.request({
            api_name: "get_previews",
            body: {
                user_id: id,
                password: password,
                current_previews: previews,
            }
        })
    },

    async set_user_property (id, password, property_name, property_value) {
        return await this.request({
            api_name: "set_user_property",
            body: {
                id: id,
                password: password,
                property_name: property_name,
                property_value: property_value,
            }
        });
    },

    async get_file(file_id = status.current_file.id, user_id = status.current_user.id, password = status.current_user.password) {
        return await this.request({
            api_name: "get_file",
            body: {
                file_id: file_id,
                user_id: user_id,
                password: password
            }
        });
    }
};
