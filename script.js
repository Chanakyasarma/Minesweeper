var board=[];
var rows =8;
var columns=8;
var minesCount=12;
var minesLocation=[];
var tilesClicked=0;
var flagEnabled=false;
var gameOver=false;
window.onload=function(){
    startGame();
}

function setMines(){
    let mineLeft=minesCount;
    while(mineLeft>0){
        let r= Math.floor(Math.random()*rows);
        let c= Math.floor(Math.random()*columns);
        let id=r.toString()+"-"+c.toString();
        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            mineLeft-=1;
        }
    }
}

function startGame(){
    document.getElementById("mines-count").innerText=minesCount;
    document.getElementById("flag-button").addEventListener("click",setFlag);
    setMines();
    for(let r=0;r<rows;r++){
        let row=[];
        for(let c=0;c<columns;c++){
            let tile =document.createElement("div");
            tile.id=r.toString()+ "-"+ c.toString();
            tile.addEventListener("click",clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);


        }
        board.push(row);
    }
    console.log(board)
}
function setFlag(){
    if(flagEnabled){
        flagEnabled=false;
        document.getElementById("flag-button").style.backgroundColor="rgb(9, 134, 125)";

    }else{
        flagEnabled=true;
        document.getElementById("flag-button").style.backgroundColor="rgb(9, 134, 61)";
    }
}

function clickTile(){

    if(gameOver||this.classList.contains('tile-clicked')){
        return;
    }
    let tile=this;
    if(flagEnabled){
        if(tile.innerText==""){
            tile.innerText="🚩";
        }
        else if(tile.innerText=="🚩"){
            tile.innerText="";
        }
        return;
    }
    if (minesLocation.includes(tile.id)) {
        revelMines();
        setTimeout(function() {
          alert("Game Over");
          location.reload();
        }, 100); // wait for 100 milliseconds before showing the alert
        gameOver = true;
        return;
      }

    let coords =tile.id.split("-");
    let r =parseInt(coords[0]);
    let c =parseInt(coords[1]);
    checkMines(r,c);
}

function revelMines(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile=board[r][c];
            if(minesLocation.includes(tile.id)){
                tile.innerText="💣"
                tile.style.backgroundColor="red";
            }
        }
    }
}

function checkMines(r,c){
    if(r<0||r>=rows||c<0||c>=columns){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked+=1;
    let minesFound=0;
    //top
    minesFound+=checkTile(r-1,c-1);
    minesFound+=checkTile(r-1,c);
    minesFound+=checkTile(r-1,c+1);

    //left& right
    minesFound+=checkTile(r,c-1);
    minesFound+=checkTile(r,c+1);

    //bottom
    minesFound+=checkTile(r+1,c-1);
    minesFound+=checkTile(r+1,c);
    minesFound+=checkTile(r+1,c+1);

    if(minesFound>0){
        board[r][c].innerText=minesFound;
        board[r][c].classList.add("x"+minesFound.toString());
    }
    else{
        checkMines(r-1,c-1);
        checkMines(r-1,c);
        checkMines(r-1,c+1);

        //left& right
        checkMines(r,c-1);
        checkMines(r,c+1);

        //bottom
        checkMines(r+1,c-1);
        checkMines(r+1,c);
        checkMines(r+1,c+1);
    }

    if(tilesClicked==rows*columns-minesCount){
        document.getElementById("mines-count").innerText="Cleared";
        gameOver=true;
    }
}

function checkTile(r,c){
    if(r<0||r>=rows||c<0||c>=columns){
        return 0;
    }
    if(minesLocation.includes(r.toString()+"-"+c.toString())){
        return 1;
    }
    return 0;
}
let time = 0;
let timer = setInterval(() => {
  time++;
  document.getElementById('timer').innerHTML = time;
}, 1000);
let firstClick = true;

function generateMines(numMines, exclude) {
  let mines = new Set();
  while (mines.size < numMines) {
    let idx = Math.floor(Math.random() * tiles.length);
    if (exclude && exclude.id === tiles[idx].id) continue;
    mines.add(tiles[idx].id);
  }
  return mines;
}

function handleClick(tile) {
  if (gameOver || tile.classList.contains("tile-clicked") || tile.classList.contains("flagged")) {
    return;
  }
  if (firstClick) {
    minesLocation = generateMines(numMines, tile);
    firstClick = false;
  }
  if (minesLocation.has(tile.id)) {
    revelMines();
    alert("Game Over");
    gameOver = true;
    location.reload(); // restart the game
    return;
  }
  let mineCount = getMineCount(tile);
  tile.classList.add("tile-clicked");
  tile.classList.add(`x${mineCount}`);
  tile.innerHTML = mineCount > 0 ? mineCount : "";
  if (mineCount === 0) {
    revealEmptyTiles(tile);
  }
  checkWin();
}
