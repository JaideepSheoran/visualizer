var gridSize = document.getElementById("rows");
var length = 0;
var startBtn = document.getElementById("mstart");
var cellSize = 0;
var wd = window.innerWidth;
var grid = [];
var result = null;
var totalVisited = 0;
var totalMines = 0;
var totalCells = 0;

document.getElementById("mstart").addEventListener('click', () => {
    console.log(startBtn);
    loop();
    totalVisited = 0;
    totalMines = 0;
    totalCells = 0;
    length = gridSize.value;
    cellSize = window.innerHeight/length;
    console.log(cellSize);
    for (var i = 0; i < length; i++) {
        grid[i] = [];
        for (var j = 0; j < length; j++) {
            grid[i][j] = new Cell(i , j , cellSize);
        }
    }
    var CANVASMINE = createCanvas(cellSize*length , window.innerHeight);
    CANVASMINE.parent('mines');
    putMines();
    countMines();
    totalMinesInGrid();
    totalCells = gridSize.value*gridSize.value;
});

function setup(){
    createGrid();
}

function totalMinesInGrid(){
    for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if(grid[i][j].isMine === true){
                    totalMines++;
                }
            }
        }
}

class Cell{
    constructor(i , j , cellSize){
        this.i = i;
        this.j = j;
        this.w = cellSize;
        this.x = this.i*this.w;
        this.y = this.j*this.w;
        this.visited = false;
        this.mine_count = 0;
        this.isMine = false;
        this.fill = {
            r:173,
            g:255,
            b:47
        };
    }

    show(){
        stroke(0);
        fill(this.fill.r , this.fill.g, this.fill.b);
        rect(this.x, this.y, this.w , this.w , this.w/5);
        if(this.visited === true && this.isMine === false){
            if(this.mine_count != 0){
              fill(0);
              textSize(cellSize/2);
              text(this.mine_count , this.x + cellSize/3 , this.y + 2*cellSize/3);
            }
        }
    }
}

function draw(){
    frameRate(5);
    background(0);
    for(var i = 0; i < length ; i++){
        for(var j = 0; j < length ; j++){
            grid[i][j].show();
        }
    }
}


function mousePressed(){
    result = gridModify(mouseX , mouseY);
    if(result === false || totalVisited + totalMines === totalCells){
        noLoop();
    }
    console.log(totalVisited);
}


function putMines(){
    for(var i = 0; i < length*length/7 ; i++){
        let x = floor(random(length));
        let y = floor(random(length));
        grid[x][y].isMine = true;
        grid[x][y].visited = true;
    }
}


function countMines(){
    for(var i = 0; i < length ; i++){
        for(var j = 0; j < length ; j++){
            if(grid[i][j].isMine == true){
                grid[i][j].mine_count = 0;
            }else{
                for(var p = -1; p <= 1 ; p++){
                    for(var q = -1; q <= 1 ; q++){
                        if((i + p) >= 0 && (i + p) <= length - 1 &&
                           (j + q) >= 0 && (j + q) <= length - 1 &&
                           grid[i + p][j + q].isMine == true){
                            grid[i][j].mine_count++;
                        }
                    }
                }
            }
        }
    }
}

function gridModify(x, y){
    if(x > cellSize*length || y > cellSize*length){
        return null;
    }
    else if(grid[floor(x/cellSize)][floor(y/cellSize)].isMine === true){
        for(var i = 0; i < length ; i++){
            for(var j = 0; j < length ; j++){
                if(grid[i][j].isMine === true){
                    grid[i][j].fill.r = 123;
                    grid[i][j].fill.g = 12;
                    grid[i][j].fill.b = 65;
                }
            }
        }
        return false;
    }
    else if(grid[floor(x/cellSize)][floor(y/cellSize)].visited === false ){
        grid[floor(x/cellSize)][floor(y/cellSize)].visited = true;
        grid[floor(x/cellSize)][floor(y/cellSize)].fill.r = 255;
        grid[floor(x/cellSize)][floor(y/cellSize)].fill.g = 217;
        grid[floor(x/cellSize)][floor(y/cellSize)].fill.b = 0;
        //getting winner
        totalVisited++;
        // if a empty cell is encountered
        if(grid[floor(x/cellSize)][floor(y/cellSize)].mine_count == 0){
            let queue = [];
            queue.push(grid[floor(x/cellSize)][floor(y/cellSize)]);
            while(queue.length > 0){
                let s = queue[0];// front of queue
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
                for(let p = -1; p <= 1 ; p++){
                    for(let q = -1; q <= 1 ; q++){
                        if((s.i + p) >= 0 && (s.i + p) <= length - 1 &&
                           (s.j + q) >= 0 && (s.j + q) <= length - 1 &&
                            grid[s.i + p][s.j + q].visited === false ){
                            if(grid[s.i + p][s.j + q].mine_count == 0){
                              grid[s.i + p][s.j + q].visited = true;
                              totalVisited++;
                              queue.push(grid[s.i + p][s.j + q]);
                            }else if(grid[s.i + p][s.j + q].isMine === false && grid[s.i + p][s.j + q].mine_count != 0){
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



 function createGrid(){
    console.log(startBtn);
    loop();
    totalVisited = 0;
    totalMines = 0;
    totalCells = 0;
    length = 10;
    cellSize = window.innerHeight/length;
    console.log(cellSize);
    for (var i = 0; i < length; i++) {
        grid[i] = [];
        for (var j = 0; j < length; j++) {
            grid[i][j] = new Cell(i , j , cellSize);
        }
    }
    var CANVASMINE = createCanvas(cellSize*length , window.innerHeight);
    CANVASMINE.parent('mines');
    putMines();
    countMines();
    totalMinesInGrid();
    totalCells = 10*10;
}