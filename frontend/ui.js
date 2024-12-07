const tmui = tmui_controls();

const element = {
    draw_screen: document.querySelector("#draw_screen"),
    canvas_wrap: document.querySelector("#canvas_wrap"),
    get canvas() { return this.canvas_wrap.children[0] },
    ui_elements: document.querySelector("#ui_elements"),
    toolbar: document.querySelector("#toolbar"),
    title: document.querySelector("#title"),
    login_email: document.querySelector("#login_email"),
    login_password: document.querySelector("#login_password"),
    current_user_name: document.querySelector("#current_user_name"),
    users_modal: document.querySelector("#users_modal"),
    create_profile_email: document.querySelector("#create_profile_email"),
    create_profile_name: document.querySelector("#create_profile_name"),
    create_profile_password: document.querySelector("#create_profile_password"),
    create_profile_password_again: document.querySelector("#create_profile_password_again"),
    create_profile_modal: document.querySelector("#create_profile_modal"),
    theme_picker: document.querySelector("#theme_picker"),
    settings_modal: document.querySelector("#settings_modal"),
    settings_name: document.querySelector("#settings_name"),
    settings_password: document.querySelector("#settings_password"),
    settings_password_again: document.querySelector("#settings_password_again"),
    files: document.querySelector("#files"),
    note_info_modal: document.querySelector("#note_info_modal"),
    note_info_title: document.querySelector("#note_info_title"),
    note_info_title_input: document.querySelector("#note_info_title_input"),
    note_info_tags_list: document.querySelector("#note_info_tags_list"),
    tags_list: document.querySelector("#tags_list"),
    tools: document.querySelector("#tools"),
}

const ui = {
    message(text, type) {
        alert(text);
    },

    rerender_user_list () { // private
        while (!element.users_modal.children[0].classList.contains("gap_before")) element.users_modal.children[0].remove();

        for (const user of local.tm.users) {
            element.users_modal.innerHTML = '<div class="horizontal_button" onclick="main.login(' + user.id + ', \'' + user.password + '\')">' + user.name + '</div>' + element.users_modal.innerHTML;
        }

        tmui.close_modal(element.users_modal);
    },

    rerender_tags_list () {
        element.tags_list.innerHTML = "";
        
        if (!status.current_user) return;
        
        for (const tag of status.current_user.limes.tags) {
            element.tags_list.innerHTML += `
                <div class="toggle" d-id="` + tag.id + `" onclick="main.toggle_tag(this)">       
                    ` + tag.name + `
                </div>
            `; 
            
            element.note_info_tags_list.innerHTML += `
                <div class="toggle" d-id="` + tag.id + `">       
                    ` + tag.name + `
                </div>
            `
        }

    },

    login (res) {
        element.current_user_name.innerHTML = res.name;
        element.settings_name.value = "";
        element.settings_name.setAttribute("placeholder", res.name);
        element.settings_password.value = "";
        element.settings_password.setAttribute("placeholder", res.password);
        element.settings_password_again.value = "";
        element.settings_password_again.setAttribute("placeholder", res.password);
        this.rerender_user_list();
        this.rerender_tags_list();
        this.set_theme(res.theme);
    },

    logout () {
        element.current_user_name.innerHTML = "Profil";
        this.rerender_user_list();
        this.rerender_tags_list();
        this.show_previews();
    },

    open_file(file_block) {
        const file_preview = file_block.querySelector(".file_preview");
        const rect = file_preview.getBoundingClientRect();
        const inset = (rect.top - window.scrollY) + "px " + (window.innerWidth-rect.left-rect.width) + "px " + (window.innerHeight-rect.top-rect.height+window.scrollY) + "px " + rect.left + "px";
        element.canvas_wrap.innerHTML = file_preview.innerHTML;
        element.title.setAttribute("placeholder", local.limes.previews.find(f => f.id == status.current_file.id).name);
        element.title.value = "";
        element.draw_screen.style.display = "block";
        element.draw_screen.animate([
            { inset: inset, backgroundColor: "var(--color-background-secondary)", borderRadius: "var(--card-border-radius)", easing: "ease-out" },
            { inset: "0px 0px 0px 0px", offset: .75, borderRadius: "calc(var(--card-border-radius) * " + (.8 * innerWidth / rect.width) + ")" },
            { inset: "0px 0px 0px 0px", backgroundColor: "black", borderRadius: "0px" }
        ], {
            duration: 1000,
        });
        element.ui_elements.animate([
            { opacity: 0, },
            { opacity: 1, },
        ], {
            duration: 1500,
        });
    },

    close_file() {
        const file_preview = document.querySelector(".file_preview svg[d-id=\""+status.current_file.id+"\"]").parentElement;
        const rect = file_preview.getBoundingClientRect();
        const inset = (rect.top - window.scrollY) + "px " + (window.innerWidth-rect.left-rect.width) + "px " + (window.innerHeight-rect.top-rect.height+window.scrollY) + "px " + rect.left + "px";
        file_preview.innerHTML = element.canvas_wrap.innerHTML;
        file_preview.children[0].setAttribute("viewBox", "0 0 1000 618");
        element.draw_screen.animate([
            { display: "block", inset: "0px 0px 0px 0px", backgroundColor: "black", borderRadius: "0px", easing: "ease-in" },
            { inset: inset, offset: .5, backgroundColor: "var(--color-background-secondary)", borderRadius: "var(--card-border-radius)", opacity: 1 },
            { display: "block", inset: inset, backgroundColor: "var(--color-background-secondary)", opacity: 0, borderRadius: "var(--card-border-radius)" }
        ], {
            duration: 1500,
        });
        element.draw_screen.style.display = "none";
        element.ui_elements.animate([
            { opacity: 1 },
            { opacity: 0, offset: .3 },
            { opacity: 0 },
        ], {
            duration: 1500,
        });
    },

    theme_list: ["dark", "light"], // private

    set_theme(theme = status.current_user.theme) {
        if (this.theme_list.indexOf(theme) == -1) {
            this.message("A(z) " + theme + " színmód nem található", "error");

            return;
        } 

        if (theme == ui.current_theme) return;

        tmui.set_theme(theme);
        element.theme_picker.checked = (theme=="dark");
    },

    get current_theme() {
        for (const theme of this.theme_list) if (document.documentElement.classList.contains(theme)) return theme;
    },

    show_previews() {
        const active_tags = status.active_tags;

        for (const preview of local.limes.previews) {
            let show_element = true;
            if (!status.current_user || preview.authors.indexOf(status.current_user.id) == -1) show_element = false;

            if (show_element) for (const tag of active_tags) if (preview.tags.find(id => id == tag.id) == undefined) {
                show_element = false;
                break;
            }
            
            if (element.files.querySelector("svg[d-id=\"" + preview.id + "\"]") == undefined) element.files.innerHTML += `
                <div onclick="main.open_file(this)" class="file_block holdable clickable" oncontextmenu="ui.open_note_info_modal(this)">
                    <div class="file_preview card spin_border" style="--border-spin-duration: 10s">
                        ` + preview.preview + `
                    </div>
                    <p class="file_title">
                        ` + preview.name + `
                    </p>
                </div>
            `;

            element.files.querySelector("svg[d-id=\"" + preview.id + "\"]").parentElement.parentElement.style.display = (show_element ? "block" : "none");
        }
    },

    open_note_info_modal(file_block) {
        const file_id = file_block.querySelector("svg").getAttribute("d-id");
        const preview = local.limes.previews.find(p => p.id == file_id);

        element.note_info_title.innerHTML = preview.name;
        element.note_info_title_input.value = "";
        element.note_info_title_input.setAttribute("placeholder", preview.name);

        tmui.open_modal(element.note_info_modal);
    },

    get binary_theme() {
        const light_themes = ["light"];

        if (light_themes.indexOf(this.current_theme) == -1) return "dark";
        return "light";
    },

    show_tools() {
        element.toolbar.innerHTML = "";

        for (const tool of toolbar.tools) {
        }
    },
};
