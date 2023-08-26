
// PHONE HEIGHT SETTING
var TEST_H = window.innerHeight;
var TEST_W = window.innerWidth;


// GLOBAL VARIABLES
var c;
var s = [];
var maze = [];

var row = 40;
var WIDTH = 1050;
var CELLSIZE = WIDTH / row;
var col = Math.floor((TEST_H - 64)/CELLSIZE) - 1;

if (TEST_H > TEST_W) {
    row = 15;
    CELLSIZE = WIDTH / row;
    col = Math.floor((TEST_H - 34)/CELLSIZE) - 1;
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
        stroke(255);
        strokeWeight(2);
        if (this.walls[0]) {
            line(this.x, this.y, this.x + this.w, this.y);
        }
        if (this.walls[1]) {
            line(this.x + this.w, this.y, this.x + this.w, this.y + this.w);
        }
        if (this.walls[2]) {
            line(this.x, this.y + this.w, this.x + this.w, this.y + this.w);
        }
        if (this.walls[3]) {
            line(this.x, this.y, this.x, this.w + this.y);
        }
    }
    remove(wall_number) {
        this.walls[wall_number] = false;
    }
}

function setup() {
    var CANVAS = createCanvas(WIDTH, CELLSIZE*col + 1);
    CANVAS.parent('pfiveboard');
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
        nbrs.push(createVector(i - 1, j));
    }
    if (i + 1 < row && !maze[i + 1][j].visited) {
        nbrs.push(createVector(i + 1, j));
    }
    if (j - 1 >= 0 && !maze[i][j - 1].visited) {
        nbrs.push(createVector(i, j - 1));
    }
    if (j + 1 < col && !maze[i][j + 1].visited) {
        nbrs.push(createVector(i, j + 1));
    }
    if (nbrs.length == 0) {
        return null;
    }
    return nbrs[floor(random(nbrs.length))];
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

    let c = createVector(10, 10);
    let n = getNbr(c.x, c.y);
    let s = [];
    s.push(createVector(c.x, c.y));
    while (!s.empty) {
        maze[c.x][c.y].visited = true;
        if (n) {
            s.push(n);
        } else {
            while (s.length > 0 && n == null) {
                s.pop();
                if (s.length == 0) { break; }
                c = createVector(s[s.length - 1].x, s[s.length - 1].y);
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

    draw();
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
        return possible[floor(random(0, possible.length))];
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

function draw() {
    background(0);
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            maze[i][j].show();
        }
    }

    if (stack.length > 1) {
        for (let k = 1; k < stack.length; k++) {
            stroke(200, 2, 120);
            strokeWeight(Math.floor(CELLSIZE / 3));
            line(stack[k - 1].x + stack[k - 1].w / 2, stack[k - 1].y + stack[k - 1].w / 2, stack[k].x + stack[k].w / 2, stack[k].y + stack[k].w / 2);
        }
    }
    // end here


    if (lp == false) {
        console.log('No Loop');
        console.log(s.length);
        if (s.length > 1) {
            for (let k = 1; k < s.length; k++) {
                stroke(58, 89, 190);
                strokeWeight(Math.floor(CELLSIZE / 3));
                line(s[k - 1].x + s[k - 1].w / 2, s[k - 1].y + s[k - 1].w / 2, s[k].x + s[k].w / 2, s[k].y + s[k].w / 2);
            }
        }
        noLoop();
    } else {
        loop();
    }
}

function keyPressed() {
    if (key == 'w' && curr.j - 1 >= 0 && !curr.walls[0]) {
        if(!maze[curr.i][curr.j - 1].visited){
            let n = maze[curr.i][curr.j - 1];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
    if (key == 's' && curr.j + 1 < col && !curr.walls[2]) {
        if(!maze[curr.i][curr.j + 1].visited){
            let n = maze[curr.i][curr.j + 1];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
    if (key == 'd' && curr.i + 1 < row && !curr.walls[1]) {
        if(!maze[curr.i + 1][curr.j].visited){
            let n = maze[curr.i + 1][curr.j];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
    if (key == 'a' && curr.i - 1 >= 0 && !curr.walls[3]) {
        if(!maze[curr.i - 1][curr.j].visited){
            let n = maze[curr.i - 1][curr.j];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
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

function leftMove() {
    if (curr.i - 1 >= 0 && !curr.walls[3]) {
        if(maze[curr.i - 1][curr.j].visited === false){
            let n = maze[curr.i - 1][curr.j];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
}
function rightMove() {
    if (curr.i + 1 < row && !curr.walls[1]) {
        if(maze[curr.i + 1][curr.j].visited === false){
            let n = maze[curr.i + 1][curr.j];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
}
function upMove() {
    if (curr.j - 1 >= 0 && !curr.walls[0]) {
        if(maze[curr.i][curr.j - 1].visited === false){
            let n = maze[curr.i][curr.j - 1];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
}
function downMove() {
    if (curr.j + 1 < col && !curr.walls[2]) {
        if(maze[curr.i][curr.j + 1].visited === false){
            let n = maze[curr.i][curr.j + 1];
            if (n != null) {
                stack.push(n);
                curr.visited = true;
                curr = n;
            }
            checkStuff();
            PATH.push(curr);
        }else{
            trackBack();
        }
    }
}

function trackBack(){
    PATH.pop();
    while(stack.length > 1 && stack[stack.length-1] != PATH[PATH.length-1]){
        stack[stack.length-1].visited = false;
        stack.pop();
    }
    curr = stack[stack.length - 1];
}