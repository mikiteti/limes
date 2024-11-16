const local = {
    tm: JSON.parse(localStorage.getItem("tm")) || {users:[]},
    limes: JSON.parse(localStorage.getItem("limes")) || {previews:[],active_user_id:[]},

    set_users() {
        this.tm.users = status.users;
        this.limes.active_user_id = status.current_user.id;
        this.set();
    },

    set_setting(setting_name, setting_value = status.current_user[setting_name]) {
        this.tm.users.find(user => user.id == status.current_user.id)[setting_name] = setting_value;
        this.set("tm");
    },

    set(which = "") {
        if (which) localStorage.setItem(which, JSON.stringify(this[which]));
        else {
            localStorage.setItem("tm", JSON.stringify(this.tm));
            localStorage.setItem("limes", JSON.stringify(this.limes));
        }
    },
};

const status = {
    current_file: {
        get id() { if (!element.canvas) return false; return element.canvas.getAttribute("d-id") },
    },

    current_user: { },

    files: [
        { id: 1, title: "New file" },
        { id: 2, title: "New file" },
    ],

    users: [ ],

    login (res) {
        let user_in_memory = this.users.find(user => user.id == res.id);
        if (user_in_memory) this.users[this.users.indexOf(user_in_memory)] = res;
        else this.users.push(res);

        this.current_user = this.users.find(user => user.id == res.id);
    },

    logout () {
        if (this.current_user.id == undefined) return;
        this.users.splice(this.users.indexOf(this.current_user), 1);
        this.current_user = {};
    }
};

