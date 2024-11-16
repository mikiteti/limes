const main = {
    login (identifier = parseInt(element.login_email.value) || element.login_email.value, password = element.login_password.value) {
        apis.login(identifier, password).then(res => {
            if (boring.log_response(res) == "error") return;

            status.login(res);
            ui.login(res);
            local.set_users();

            console.log(res);
        });
    },

    logout () {
        status.logout();
        ui.logout();
        local.set_users();
    },

    create_profile (email = element.create_profile_email.value, name = element.create_profile_name.value, password = element.create_profile_password.value, password_again = element.create_profile_password_again.value) {
        if (password != password_again) {
            ui.message("A jelszavak nem egyeznek.", "error");
            return;
        }
        apis.create_profile(email, name, password).then(res => {
            if (boring.log_response(res) == "error") return;
            
            this.login(res.id, res.password);
        });
    },

    set_theme(theme = status.current_user.theme) {
        ui.set_theme(theme);
        if (!status.current_user.id) return;

        status.current_user.theme = theme;
        local.set_users();
        apis.set_user_property(status.current_user.id, status.current_user.password, "theme", theme).then(res => {
            if (boring.log_response(res) == "error") return;
        });
    }
}

const onload = () => {
    status.users = local.tm.users;
    status.current_user = status.users.find(user => user.id == local.limes.active_user_id);
    main.login(status.current_user.id, status.current_user.password);
}
window.addEventListener("load", onload);
