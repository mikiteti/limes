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
}

const ui = {
    message(text, type) {
        alert(text);
    },

    rerender_user_list () { // private
        while (!element.users_modal.children[0].classList.contains("gap_before")) element.users_modal.children[0].remove();

        for (const user of status.users) {
            element.users_modal.innerHTML = '<div class="horizontal_button" onclick="main.login(' + user.id + ', \'' + user.password + '\')">' + user.name + '</div>' + element.users_modal.innerHTML;
        }

        tmui.close_modal(element.users_modal);
    },

    login (res) {
        element.current_user_name.innerHTML = res.name;
        this.rerender_user_list();
    },

    logout () {
        element.current_user_name.innerHTML = "Profil";
        this.rerender_user_list();
    },

    open_file(file_block) {
        const file_preview = file_block.querySelector(".file_preview");
        const rect = file_preview.getBoundingClientRect();
        const inset = (rect.top - window.scrollY) + "px " + (window.innerWidth-rect.left-rect.width) + "px " + (window.innerHeight-rect.top-rect.height+window.scrollY) + "px " + rect.left + "px";
        element.canvas_wrap.innerHTML = file_preview.innerHTML;
        element.title.setAttribute("placeholder", status.files.find(f => f.id == status.current_file.id).title);
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

    get current_theme() {
        const theme_list = ["dark", "light"];

        for (const theme of theme_list) if (document.documentElement.classList.contains(theme)) return theme;
    }
};
