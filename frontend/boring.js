const boring = {
    log_response(res) {
        if (res.error) {
            console.log({error: res.error});
            ui.message(res.error.name, "error");
            delete res.error;
            return "error";
        }
        if (res.success) {
            console.log({success: res.success});
            delete res.success;
        }
    },

    set_grid() {
        while (status.grid.length * status.settings.cell_size < status.page.height) {
            const row = [];
            for (let i = 0; i < 1; i += status.settings.cell_size) row.push([]);
            status.grid.push([...row]);
        }
    },

    import_file(id = status.current_file.id, content, callback = () => { return; }) {
        status.toolbar = content.toolbar;
        status.page = content.page;
        status.strokes.all = [];
        status.grid = [];
        status.undisplayed_strokes = [];
        for (let i = 0; i < status.page.height/status.settings.cell_size+1; i++) status.undisplayed_strokes.push([]);
        this.set_grid();

        const recursive = (index) => {
            const s = content.strokes[index];
            new stroke(s.nodes, "canvas", s.index, s.min, s.max, content.used_tools[s.tool], s.scale, s.theme);
            if (index < content.strokes.length - 1) queueMicrotask(() => { recursive(index+1) });
            else callback();
        }
        if (content.strokes.length) recursive(0);

        element.canvas.setAttributeNS(null, "viewBox", "0 0 1000 " + (status.page.height*1000));
    },

    get_grid_cell_at(x, y) {
        return status.grid[Math.max(0, Math.floor(y/status.settings.cell_size))][Math.max(0, Math.floor(Math.min(x, 1) / status.settings.cell_size))];
    },
};
