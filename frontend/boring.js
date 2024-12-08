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
        while (grid.length * status.settings.cell_size < page.height) {
            const row = [];
            for (let i = 0; i < 1; i += status.settings.cell_size) row.push([]);
            grid.push([...row]);
        }
    },

    import_file(id = status.current_file.id, content, callback = () => { return; }) {
        toolbar = content.toolbar;
        page = content.page;
        strokes.all = [];
        grid = [];
        status.undisplayed_strokes = [];
        for (let i = 0; i < page.height/status.settings.cell_size+1; i++) status.undisplayed_strokes.push([]);
        this.set_grid();

        const recursive = (index) => {
            const s = content.strokes[index];
            new stroke(s.nodes, "canvas", s.index, s.min, s.max, content.used_tools[s.tool], s.scale, s.theme);
            if (index < content.strokes.length - 1) queueMicrotask(() => { recursive(index+1) });
            else callback();
        }
        if (content.strokes.length) recursive(0);

        element.canvas.setAttributeNS(null, "viewBox", "0 0 1000 " + (page.height*1000));

        page.current_tool = toolbar.tools[0]; // for now
    },

    get_grid_cell_at(x, y) {
        return grid[Math.max(0, Math.floor(y/status.settings.cell_size))][Math.max(0, Math.floor(Math.min(x, 1) / status.settings.cell_size))];
    },

    calculate_iteration_value (x, y) {
        if (y == 0) return pointer.active.pos;
        const csi = page.current_stroke.iterations;
        return [
            (csi[y-1][Math.max(x-1,0)][0] + csi[y-1][x][0] + csi[y-1][x+1][0]) / 3,
            (csi[y-1][Math.max(x-1,0)][1] + csi[y-1][x][1] + csi[y-1][x+1][1]) / 3
        ];
    },

};

