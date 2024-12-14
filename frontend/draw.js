let toolbar = {
    tools: [
        {
            type: "pen",
            color: "white",
            radius: 0.01,
            smoothness: 5,
        }
    ],
}, page = {
    current_iterations: [],
    stroke_count: 0,
    current_tool: toolbar.tools[0],
}, strokes = {
    all: [],
    get alive() { return this.all.filter(s => !s.deleted) },
    get deleted() { return this.all.filter(s => s.deleted) },
}, grid = [];

class stroke {
    create_element() {
        if (this.element) return -1;

        const e = document.createElementNS('http://www.w3.org/2000/svg',"path");
        this.element = e;

        if (this.tool.type == "calligraphy") {
            e.setAttributeNS(null, "stroke", this.tool.color);
            e.setAttributeNS(null, "stroke-width", String(1000*Math.max(settings.minimal_stroke_radius, (1-this.tool.angle_sensitivity)*this.tool.radius)*this.scale));
        } else e.setAttributeNS(null, "stroke", "none");

        e.setAttributeNS(null, "fill", this.tool.color);
        e.setAttribute("d-id", "stroke-" + this.index);
        e.setAttribute("d-color", this.tool.color);
        e.setAttribute("d-theme", ui.theme);
        e.setAttributeNS(null, "d", "M" + ((this.nodes[0][0]-this.tool.radius)*1000) + ", " + (this.nodes[0][1]*1000) + 
            " a" + String(1000*this.tool.radius) + ", " + String(1000*this.tool.radius) + ", 0, 1, 1, " + String(2000*this.tool.radius) + ", 0" + 
            " a " + String(1000*this.tool.radius) + ", " + String(1000*this.tool.radius) + ", 0, 1, 1, " + String(-2000*this.tool.radius) + ", 0 z"
        );

        element.canvas.appendChild(e);
    }

    delete() {
        this.element.remove();
        for (const row of grid) for (const c of row) if (c.includes(this)) c.splice(c.indexOf(this), 1); // sorry, i may fix this later
        this.deleted = true;
    }

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

    create_last_node() {
       let index = page.current_iterations[0].length;

        for (let d = 0; d <= Math.min(this.tool.smoothness, this.nodes.length); d++) {
            page.current_iterations[d][index-d] = boring.calculate_iteration_value(index-d, d);
        }
    
        index = page.current_iterations[0].length;
        let new_coord = undefined;
        if (this.nodes.length <= this.tool.smoothness) {
            if (index % 2 == 1) new_coord = page.current_iterations[(index-1) / 2][(index-1) / 2];
        } else {
            new_coord = page.current_iterations.at(-1).at(-1);
            for (const i of page.current_iterations) i.shift();
        }
    
        if (new_coord) {
            this.nodes.push(new_coord.map(coord => parseFloat(coord.toFixed(6))));
    
            // this.draw_last_node();
        }
    
        return new_coord;
    }

    constructor (
        nodes = [],
        type = "canvas",
        index = page.stroke_count,
        min = {},
        max = {},
        tool = type == "canvas" ? JSON.parse(JSON.stringify(page.current_tool)) : undefined,
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

        ({canvas: strokes.all, preview: []})[type].push(this);

        if (type == "preview") return;
        if (current) page.current_stroke = this;

        if (!nodes.length) { // being drawn by user right now
            page.stroke_count++;
            
            let grid_cell = boring.get_grid_cell_at(...pointers.active.pos);
            grid_cell.push(this);
            this.grid_cells.push(grid_cell);

            page.current_iterations = [];
            for (let i = 0; i < page.current_tool.smoothness; i++) page.current_iterations.push([]);

            this.create_last_node();
            // this.nodes.push([...pointers.active.pos]);
            // this.min = {x: pointers.active.pos[0], y: pointers.active.pos[1]};
            // this.max = JSON.parse(JSON.stringify(this.min));
        } else { // being imported
            this.element = element.canvas.querySelector("[d-id=stroke-" + index + "]");
            this.undisplayed_rows = [];
            if (this.element == undefined) {
                for (let i = Math.floor(min.y/status.settings.cell_size); i < Math.ceil(max.y/status.settings.cell_size); i++) {
                    status.undisplayed_strokes[i].push(this);
                    this.undisplayed_rows.push(status.undisplayed_strokes[i]);
                }
            } else {
                for (const n of nodes) this.check_min_max_and_grid(n);
            }
        }
    }
}

const pointer = {
    pointers: {},

    down(e) {
        down.initialize_globals(e);

        switch (page.current_tool.type) {
            case "pen": new stroke; break;
        }
    },

    move(e) {
        move.initialize_globals(e);
    },

    up(e) {
        up.initialize_globals(e);
    },

    get pen() { return this.pointers.find(p => p.type == "pen") },

    get active() { return this.pen || this.pointers[0] },
}

const down = {
    initialize_globals(e) {
        const { pointerId, pointerType } = e;
        pointer.pointers[pointerId] = {
            pos: [1000 / window.innerWidth * e.offsetX, 1000 / window.innerWidth * e.offsetY], 
            type: pointerType, 
            prev_pos:this.pos
        };
    },
}

const move = {
    initialize_globals(e) {
        const { pointerId, pointerType } = e;
        if (pointer.pointers[pointerId] == undefined) return;

        const current_pointer = pointer.pointers[pointerId];
        current_pointer.prev_pos = [...current_pointer.pos];
        current_pointer.pos = [e.offsetX, e.offsetY];
    },
}

const up = {
    initialize_globals(e) {
        delete pointer.pointers[e.pointerId];
    },
}
