const tmui = tmui_controls();

const element = {
    drawing_screen: document.querySelector("#drawing_screen"),
    canvas: document.querySelector("#canvas"),
}

const ui = {
    open_file(file_block) {
        const rect = file_block.querySelector(".file_preview").getBoundingClientRect();
        const inset = (rect.top - window.scrollY) + "px " + (window.innerWidth-rect.left-rect.width) + "px " + (window.innerHeight-rect.top-rect.height+window.scrollY) + "px " + rect.left + "px";
        element.drawing_screen.style.display = "block";
        element.drawing_screen.animate([
            { inset: inset, backgroundColor: "var(--color-background-secondary)", borderRadius: "var(--card-border-radius)", overflowY: "hidden" },
            { inset: "0px 0px 0px 0px", backgroundColor: "black", borderRadius: "0px", overflowY: "hidden" }
        ], {
            duration: 500,
            // fill: "forwards",
        });
        setTimeout(() => {
//           element.drawing_screen.style.inset = "0px 0px 0px 0px";
        }, 500);
    }
};
