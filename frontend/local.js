const local = {
    tm: JSON.parse(localStorage.getItem("tm")) || {users:[]},
    limes: JSON.parse(localStorage.getItem("limes")) || {previews:[],active_user_id: undefined},

    erase_all() {
        this.tm = null;
        this.limes = null;
        this.set();
    },

    set_users() {
        this.limes.active_user_id = (status.current_user || {id: undefined}).id;
        this.set();
    },

    set_setting(setting_name, setting_value = status.current_user[setting_name]) {
        this.tm.users.find(user => user.id == status.current_user.id)[setting_name] = setting_value;
        this.set("tm");
    },

    set_previews(res) {
        for (const new_preview of res.previews) {
            let current_preview = this.limes.previews.find(p => p.id == new_preview.id);
            if (!current_preview) {
                this.limes.previews.push(new_preview);
                continue;
            }
            this.limes.previews[this.limes.previews.indexOf(current_preview)] = new_preview;
        }
        
        this.set("limes");
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
    settings: {
        cell_size: .1,
        minimal_stroke_radius: .00025,
    },

    current_file: {
        get id() { if (!element.canvas) return false; return element.canvas.getAttribute("d-id") },
        get local() { return local.limes.previews.find(preview => preview.id == this.id) },
    },

    get current_user() { return local.tm.users.find(user => user.id == local.limes.active_user_id) },

    get active_tags() {
        if (!this.current_user) return false;
        return this.current_user.limes.tags.filter(tag => tag.active);
    },

    login (res) {
        local.limes.active_user_id = res.id;
        let user_in_memory = local.tm.users.find(user => user.id == res.id);
        if (user_in_memory) local.tm.users[local.tm.users.indexOf(user_in_memory)] = res;
        else local.tm.users.push(res);
    },

    logout () {
        if (this.current_user.id == undefined) return;
        local.tm.users.splice(local.tm.users.indexOf(this.current_user), 1);
    },
};
