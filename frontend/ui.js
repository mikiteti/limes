const tmui = tmui_controls();

const element = {
    draw_screen: document.querySelector("#draw_screen"),
    canvas_wrap: document.querySelector("#canvas_wrap"),
    get canvas() { return this.canvas_wrap.children[0] },
    ui_elements: document.querySelector("#ui_elements"),
    toolbar: document.querySelector("#toolbar"),
    title: document.querySelector("#title"),
}

const ui = {
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
            { inset: "0px 0px 0px 0px", offset: .5, borderRadius: "calc(var(--card-border-radius) * " + (.8 * innerWidth / rect.width) + ")" },
            { inset: "0px 0px 0px 0px", backgroundColor: "black", borderRadius: "0px" }
        ], {
            duration: 1500,
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
    }
};
