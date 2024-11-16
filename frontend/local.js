const local = {
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

