const source = "http://localhost:2517";
// const source = "https://tetimiki.hu/notes";

const apis = {
    request (json) {
        json.random = Math.random();
        console.log("Sending request: ", json.api_name);
        return fetch(source+"/request", { cache: "no-store", method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) }).then(res => res.json());
    },

    async get_file(file_id = status.current_file.id, user_id = status.current_user.id, password = status.current_user.password) {
        return await this.request({
            api_name: "get_file",
            body: {
                file_id: file_id,
                user_id: user_id,
                password: password
            }
        })
    }
};
