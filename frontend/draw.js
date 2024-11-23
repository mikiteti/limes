class stroke {
    check_min_max_and_grid(new_coord) {
        this.min = { x: Math.min(new_coord[0], this.min.x || Infinity), y: Math.min(new_coord[1], this.min.y || Infinity) };
        this.max = { x: Math.max(new_coord[0], this.max.x || 0), y: Math.max(new_coord[1], this.max.y || 0) };

        if (this.type == "preview") return;

        const grid_cell = boring.get_grid_cell_at(...new_coord);
        if (grid_cell && !grid_cell.includes(this)) {
            grid_cell.push(this);
            this.grid_cells.push(grid_cell);
        }
    }

    constructor (
        nodes = [],
        type = "canvas",
        index = status.page.stroke_count,
        min = {},
        max = {},
        tool = type == "canvas" ? JSON.parse(JSON.stringify(status.page.current_tool)) : undefined,
        scale = 1,
        theme = ui.binary_theme,
        current = true,
    ) {
        this.nodes = nodes;
        this.type = type;
        this.index = index;
        this.min = min;
        this.max = max;
        this.tool = tool;
        this.scale = scale;
        this.theme = theme;

        this.grid_cells = [];
        this.element = undefined;

        ({canvas: status.strokes.all, preview: []})[type].push(this);

        if (type == "preview") return;
        if (current) status.page.current_stroke = this;

        if (!nodes.length) { // being drawn by user right now

        } else { // being imported
            this.element = element.canvas.querySelector("[d-id=stroke-" + index + "]");
            this.undisplayed_rows = [];
            if (this.element == undefined) {
                for (let i = Math.floor(min.y/status.settings.cell_size); i < Math.ceil(max.y/status.settings.cell_size); i++) {
                    status.undisplayed_strokes[i].push(this);
                    this.undisplayed_rows.push(status.undisplayed_strokes[i]);
                }
            } else {
                nodes.forEach(n => { this.check_min_max_and_grid(n) });
            }
        }
    }
}
