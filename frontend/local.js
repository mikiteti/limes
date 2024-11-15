const local = {

};

const status = {
    current_file: {
        get id() { if (!element.canvas) return false; return element.canvas.getAttribute("d-id") },
    },

    current_user: {
        id: 1,
        password: "Falmaszas7",
    },

    files: [
        { id: 1, title: "New file" },
        { id: 2, title: "New file" },
    ]
};
