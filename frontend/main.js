const main = {
    login (identifier = parseInt(element.login_email.value) || element.login_email.value, password = element.login_password.value) {
        apis.login(identifier, password).then(res => {
            if (boring.log_response(res) == "error") return;

            status.login(res);
            ui.login(res);
            local.set_users();

            apis.get_previews(status.current_user.id, status.current_user.password, previews = local.limes.previews.map(preview => {return {id: preview.id, last_changed: preview.preview_last_changed}})).then(res => {
                if (boring.log_response(res) == "error") return;
                
                local.set_previews(res);
                ui.show_previews();
            });
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
    },

    set_user_settings(name = element.settings_name.value, password = element.settings_password.value, password_again = element.settings_password_again.value) {
        if (password != password_again) {
            ui.message("A jelszavak nem egyeznek.", "error");
            return;
        }
        
        if (name) {
            status.current_user.name = name;
            apis.set_user_property(status.current_user.id, status.current_user.password, "name", name).then(res => { if (boring.log_response(res) == "error") return; });
        }
        if (password) {
            status.current_user.password = password;
            apis.set_user_property(status.current_user.id, status.current_user.password, "password", password).then(res => { if (boring.log_response(res) == "error") return; });
        } 

        console.log(status.current_user);
        ui.login(status.current_user);
        local.set_users();

        tmui.close_modal(element.settings_modal);
    }
}

const onload = () => {
    status.users = local.tm.users;
    status.current_user = status.users.find(user => user.id == local.limes.active_user_id);
    if (status.current_user) {
        main.login(status.current_user.id, status.current_user.password);
    }
}
window.addEventListener("load", onload);
