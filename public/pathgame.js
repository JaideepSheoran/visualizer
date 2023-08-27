var swipperGame = (p) => {

    var gridSize = { value: 16 };
    var length = 0;
    var startBtn = document.getElementById('startmines');
    var cellSize = 0;
    var wd = window.innerWidth;
    var grid = [];
    var result = null;
    var totalVisited = 0;
    var totalMines = 0;
    var totalCells = 0;

    p.setup = () => {
        createGrid();
        gridSize = null;
        if (document.getElementById('rows') != null) {
            gridSize = document.getElementById('rows');
        }
        if (document.getElementById('startmines') != null) {
            document.getElementById('startmines').addEventListener('click', createGrid);
        }
    }

    p.totalMinesInGrid = () => {
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (grid[i][j].isMine === true) {
                    totalMines++;
                }
            }
        }
    }

    class Cell {
        constructor(i, j, cellSize) {
            this.i = i;
            this.j = j;
            this.w = cellSize;
            this.x = this.i * this.w;
            this.y = this.j * this.w;
            this.visited = false;
            this.mine_count = 0;
            this.isMine = false;
            this.fill = {
                r: 173,
                g: 255,
                b: 47
            };
        }

        show() {
            p.stroke(0);
            p.fill(this.fill.r, this.fill.g, this.fill.b);
            p.rect(this.x, this.y, this.w, this.w, this.w / 5);
            if (this.visited === true && this.isMine === false) {
                if (this.mine_count != 0) {
                    p.fill(0);
                    p.textSize(cellSize / 2);
                    p.text(this.mine_count, this.x + cellSize / 3, this.y + 2 * cellSize / 3);
                }
            }
        }
    }

    p.draw = () => {
        p.frameRate(5);
        p.background(0);
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                grid[i][j].show();
            }
        }
    }


    p.mousePressed = () => {
        result = gridModify(p.mouseX, p.mouseY);
        if (result === false || totalVisited + totalMines === totalCells) {
            p.noLoop();
        }
        console.log(totalVisited);
    }


    p.putMines = () => {
        for (var i = 0; i < length * length / 7; i++) {
            let x = p.floor(p.random(length));
            let y = p.floor(p.random(length));
            grid[x][y].isMine = true;
            grid[x][y].visited = true;
        }
    }


    p.countMines = () => {
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (grid[i][j].isMine == true) {
                    grid[i][j].mine_count = 0;
                } else {
                    for (var p = -1; p <= 1; p++) {
                        for (var q = -1; q <= 1; q++) {
                            if ((i + p) >= 0 && (i + p) <= length - 1 &&
                                (j + q) >= 0 && (j + q) <= length - 1 &&
                                grid[i + p][j + q].isMine == true) {
                                grid[i][j].mine_count++;
                            }
                        }
                    }
                }
            }
        }
    }

    function createGrid() {
        p.loop();
        totalVisited = 0;
        totalMines = 0;
        totalCells = 0;
        length = gridSize.value;
        cellSize = window.innerHeight / length;
        console.log(cellSize);
        for (var i = 0; i < length; i++) {
            grid[i] = [];
            for (var j = 0; j < length; j++) {
                grid[i][j] = new Cell(i, j, cellSize);
            }
        }
        var CANVAS = p.createCanvas(cellSize * length, window.innerHeight);
        p.putMines();
        p.countMines();
        p.totalMinesInGrid();
        totalCells = gridSize.value * gridSize.value;
    }

    function gridModify(x, y) {
        if (x > cellSize * length || y > cellSize * length || p.floor(x / cellSize) < 0 || p.floor(x / cellSize) >= grid.length || p.floor(y / cellSize) < 0 || p.floor(y / cellSize) >= grid.length) {
            return null;
        } else if (grid[p.floor(x / cellSize)][p.floor(y / cellSize)].isMine === true) {
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (grid[i][j].isMine === true) {
                        grid[i][j].fill.r = 123;
                        grid[i][j].fill.g = 12;
                        grid[i][j].fill.b = 65;
                    }
                }
            }
            return false;
        } else if (grid[p.floor(x / cellSize)][p.floor(y / cellSize)].visited === false) {
            grid[p.floor(x / cellSize)][p.floor(y / cellSize)].visited = true;
            grid[p.floor(x / cellSize)][p.floor(y / cellSize)].fill.r = 255;
            grid[p.floor(x / cellSize)][p.floor(y / cellSize)].fill.g = 217;
            grid[p.floor(x / cellSize)][p.floor(y / cellSize)].fill.b = 0;
            //getting winner
            totalVisited++;
            // if a empty cell is encountered
            if (grid[p.floor(x / cellSize)][p.floor(y / cellSize)].mine_count == 0) {
                let queue = [];
                queue.push(grid[p.floor(x / cellSize)][p.floor(y / cellSize)]);
                while (queue.length > 0) {
                    let s = queue[0]; // front of queue
                    // pop from queue
                    queue.reverse();
                    queue.pop();
                    queue.reverse();
                    // ends here
                    s.visited = true;
                    s.fill.r = 0;
                    s.fill.g = 0;
                    s.fill.b = 0;

                    // check neoghbours for 0
                    for (let p = -1; p <= 1; p++) {
                        for (let q = -1; q <= 1; q++) {
                            if ((s.i + p) >= 0 && (s.i + p) <= length - 1 &&
                                (s.j + q) >= 0 && (s.j + q) <= length - 1 &&
                                grid[s.i + p][s.j + q].visited === false) {
                                if (grid[s.i + p][s.j + q].mine_count == 0) {
                                    grid[s.i + p][s.j + q].visited = true;
                                    totalVisited++;
                                    queue.push(grid[s.i + p][s.j + q]);
                                } else if (grid[s.i + p][s.j + q].isMine === false && grid[s.i + p][s.j + q].mine_count != 0) {
                                    grid[s.i + p][s.j + q].visited = true;
                                    totalVisited++;
                                    grid[s.i + p][s.j + q].fill.r = 255;
                                    grid[s.i + p][s.j + q].fill.g = 217;
                                    grid[s.i + p][s.j + q].fill.b = 0;
                                }
                            }
                        }
                    }
                    // check ends here
                }
            }
            return true;
        }
        return null;
    }

}


var mazeGame = (p) => {


    var solveMazeButton = document.getElementById('mazesolve');
    var resetMazeButton = document.getElementById('mazereset');
    // PHONE HEIGHT SETTING
    var TEST_H = window.innerHeight;
    var TEST_W = window.innerWidth;


    // GLOBAL VARIABLES
    var c;
    var s = [];
    var maze = [];

    var row = 30;
    var WIDTH = 800;
    var CELLSIZE = WIDTH / row;
    var col = Math.floor((TEST_H - 64) / CELLSIZE) - 1;

    if (TEST_H > TEST_W) {
        row = 15;
        CELLSIZE = WIDTH / row;
        col = Math.floor((TEST_H - 34) / CELLSIZE) - 1;
    }

    // For live match
    var curr;
    var stack = [];
    var PATH = [];
    // For stopping 
    var lp = true;



    class cell {
        constructor(i, j) {
            this.i = i;
            this.j = j;
            this.w = CELLSIZE;
            this.x = this.i * this.w;
            this.y = this.j * this.w;
            this.visited = false;
            this.walls = [true, true, true, true];
        }

        show() {
            p.stroke(255);
            p.strokeWeight(2);
            if (this.walls[0]) {
                p.line(this.x, this.y, this.x + this.w, this.y);
            }
            if (this.walls[1]) {
                p.line(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
            }
            if (this.walls[2]) {
                p.line(this.x, this.y + this.w, this.x + this.w, this.y + this.w);
            }
            if (this.walls[3]) {
                p.line(this.x, this.y, this.x, this.w + this.y);
            }
        }
        remove(wall_number) {
            this.walls[wall_number] = false;
        }
    }

    p.setup = () => {

        document.getElementById('mazesolve').addEventListener('click', solveMaze);
        document.getElementById('mazereset').addEventListener('click', createMaze);

        p.createCanvas(WIDTH, CELLSIZE * col + 1);
        for (var i = 0; i < row; i++) {
            maze[i] = [];
            for (var j = 0; j < col; j++) {
                maze[i][j] = new cell(i, j);
            }
        }
        createMaze();
        // c = maze[0][0];
        curr = maze[0][0];
        //c.visited = true;
        curr.visited = true;
        //s.push(c);
        stack.push(curr);
        PATH.push(curr);
    }

    function getNbr(i, j) {
        var nbrs = [];
        if (i - 1 >= 0 && !maze[i - 1][j].visited) {
            nbrs.push(p.createVector(i - 1, j));
        }
        if (i + 1 < row && !maze[i + 1][j].visited) {
            nbrs.push(p.createVector(i + 1, j));
        }
        if (j - 1 >= 0 && !maze[i][j - 1].visited) {
            nbrs.push(p.createVector(i, j - 1));
        }
        if (j + 1 < col && !maze[i][j + 1].visited) {
            nbrs.push(p.createVector(i, j + 1));
        }
        if (nbrs.length == 0) {
            return null;
        }
        return nbrs[p.floor(p.random(nbrs.length))];
    }

    function createMaze() {
        // start loop 
        lp = true;
        // added later
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                maze[i][j].walls = [true, true, true, true];
                maze[i][j].visited = false;
            }
        }

        while (stack.length != 0) {
            stack.pop();
        }
        curr = maze[0][0];
        // curr.visited = true;
        stack.push(curr);
        // ends here

        let c = p.createVector(10, 10);
        let n = getNbr(c.x, c.y);
        let s = [];
        s.push(p.createVector(c.x, c.y));
        while (!s.empty) {
            maze[c.x][c.y].visited = true;
            if (n) {
                s.push(n);
            } else {
                while (s.length > 0 && n == null) {
                    s.pop();
                    if (s.length == 0) { break; }
                    c = p.createVector(s[s.length - 1].x, s[s.length - 1].y);
                    n = getNbr(c.x, c.y);
                }
                if (s.length == 0) { break; }
            }
            if (c.x - n.x == 1 && c.y - n.y == 0) {
                maze[c.x][c.y].remove(3);
                maze[n.x][n.y].remove(1);
            }
            if (c.x - n.x == -1 && c.y - n.y == 0) {
                maze[c.x][c.y].remove(1);
                maze[n.x][n.y].remove(3);
            }
            if (c.x - n.x == 0 && c.y - n.y == 1) {
                maze[c.x][c.y].remove(0);
                maze[n.x][n.y].remove(2);
            }
            if (c.x - n.x == 0 && c.y - n.y == -1) {
                maze[c.x][c.y].remove(2);
                maze[n.x][n.y].remove(0);
            }
            c = n;
            n = getNbr(c.x, c.y);

        }
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                maze[i][j].visited = false;
            }
        }

        p.draw();
    }

    function move(i, j) {
        var curr = maze[i][j];
        let possible = [];
        if (j - 1 >= 0 && !curr.walls[0] && !maze[i][j - 1].visited) {
            possible.push(maze[i][j - 1]);
        }
        if (j + 1 < col && !curr.walls[2] && !maze[i][j + 1].visited) {
            possible.push(maze[i][j + 1]);
        }
        if (i - 1 >= 0 && !curr.walls[3] && !maze[i - 1][j].visited) {
            possible.push(maze[i - 1][j]);
        }
        if (i + 1 < row && !curr.walls[1] && !maze[i + 1][j].visited) {
            possible.push(maze[i + 1][j]);
        }

        if (possible.length >= 1) {
            return possible[p.floor(p.random(0, possible.length))];
        }
        return null;
    }

    function solveMaze() {
        // making all unvisited
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                maze[i][j].visited = false;
            }
        }
        // end here
        c = maze[0][0];
        c.visited = true;
        s = [];
        s.push(c);
        while (c.i != row - 1 || c.j != col - 1) {
            var n = move(c.i, c.j);
            if (n) {
                c = n;
            } else {
                while (s.length > 0 && n == null) {
                    s.pop();
                    if (s.length == 0) { break; }
                    c = s[s.length - 1];
                    n = move(c.i, c.j);
                }
                if (s.length == 0) { break; }
            }
            c.visited = true;
            s.push(c);
        }
        lp = false;
    }

    p.draw = () => {
        p.background(0);
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < col; j++) {
                maze[i][j].show();
            }
        }

        if (stack.length > 1) {
            for (let k = 1; k < stack.length; k++) {
                p.stroke(200, 2, 120);
                p.strokeWeight(Math.floor(CELLSIZE / 3));
                p.line(stack[k - 1].x + stack[k - 1].w / 2, stack[k - 1].y + stack[k - 1].w / 2, stack[k].x + stack[k].w / 2, stack[k].y + stack[k].w / 2);
            }
        }
        // end here


        if (lp == false) {
            console.log('No Loop');
            console.log(s.length);
            if (s.length > 1) {
                for (let k = 1; k < s.length; k++) {
                    p.stroke(58, 89, 190);
                    p.strokeWeight(Math.floor(CELLSIZE / 3));
                    p.line(s[k - 1].x + s[k - 1].w / 2, s[k - 1].y + s[k - 1].w / 2, s[k].x + s[k].w / 2, s[k].y + s[k].w / 2);
                }
            }
            p.noLoop();
        } else {
            p.loop();
        }
    }

    p.keyPressed = () => {
        if (p.key == 'w' && curr.j - 1 >= 0 && !curr.walls[0]) {
            if (!maze[curr.i][curr.j - 1].visited) {
                let n = maze[curr.i][curr.j - 1];
                if (n != null) {
                    stack.push(n);
                    curr.visited = true;
                    curr = n;
                }
                checkStuff();
                PATH.push(curr);
            } else {
                trackBack();
            }
        }
        if (p.key == 's' && curr.j + 1 < col && !curr.walls[2]) {
            if (!maze[curr.i][curr.j + 1].visited) {
                let n = maze[curr.i][curr.j + 1];
                if (n != null) {
                    stack.push(n);
                    curr.visited = true;
                    curr = n;
                }
                checkStuff();
                PATH.push(curr);
            } else {
                trackBack();
            }
        }
        if (p.key == 'd' && curr.i + 1 < row && !curr.walls[1]) {
            if (!maze[curr.i + 1][curr.j].visited) {
                let n = maze[curr.i + 1][curr.j];
                if (n != null) {
                    stack.push(n);
                    curr.visited = true;
                    curr = n;
                }
                checkStuff();
                PATH.push(curr);
            } else {
                trackBack();
            }
        }
        if (p.key == 'a' && curr.i - 1 >= 0 && !curr.walls[3]) {
            if (!maze[curr.i - 1][curr.j].visited) {
                let n = maze[curr.i - 1][curr.j];
                if (n != null) {
                    stack.push(n);
                    curr.visited = true;
                    curr = n;
                }
                checkStuff();
                PATH.push(curr);
            } else {
                trackBack();
            }
        }
        return null;
    }

    function checkStuff() {
        let n = onlyOneMove(curr.i, curr.j);
        if (curr.i == row - 1 && curr.j == col - 1) {
            WINDIV.style.display = 'flex';
            return null;
        }
        while (n != null) {
            stack.push(n);
            curr.visited = true;
            curr = n;
            n = onlyOneMove(curr.i, curr.j);
            if (curr.i == row - 1 && curr.j == col - 1) {
                return null;
            }
        }
    }

    function onlyOneMove(i, j) {
        var curr = maze[i][j];
        let possible = [];
        if (j - 1 >= 0 && !curr.walls[0] && !maze[i][j - 1].visited) {
            possible.push(maze[i][j - 1]);
        }
        if (j + 1 < col && !curr.walls[2] && !maze[i][j + 1].visited) {
            possible.push(maze[i][j + 1]);
        }
        if (i - 1 >= 0 && !curr.walls[3] && !maze[i - 1][j].visited) {
            possible.push(maze[i - 1][j]);
        }
        if (i + 1 < row && !curr.walls[1] && !maze[i + 1][j].visited) {
            possible.push(maze[i + 1][j]);
        }

        if (possible.length == 1) {
            return possible[0];
        }
        return null;
    }

    function trackBack() {
        PATH.pop();
        while (stack.length > 1 && stack[stack.length - 1] != PATH[PATH.length - 1]) {
            stack[stack.length - 1].visited = false;
            stack.pop();
        }
        curr = stack[stack.length - 1];
    }
}

var myp6 = new p5(mazeGame, 'mazegame');
var myp5 = new p5(swipperGame, 'swippergame');