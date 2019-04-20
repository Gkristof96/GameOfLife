var Rows = 1000; //Array sorok száma
var Column = 1000; //Array oszlopok száma
var cellWidth = 10; //cella szélesség
var cellHeight= 10; //cella magasság

var maxRow = 0; //maximálisan használt sorok indexe
var maxColumn = 0; //maximálisan használt oszlopok indexe

var canvasMaxRow=60; // az aktuálisan látható sorok száma
var canvasMaxColumn=80; // az aktuálisan látható oszlopok száma

var draw = 1; //írási jog rajzvászonhoz

function Cell(row, column) {
  this.row = row;
  this.column = column;
}
function getCursorPosition(e) {
  // Kurzor koordináták kiszámítása 
  var x;
  var y;
  // x és y koordináta meghatározása a dokumentumon belül
  if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
  }
  else {
	x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  // x és y koordinátsa meghatározása a rajzvászonhoz képest
  x -= canvasElement.offsetLeft;
  y -= canvasElement.offsetTop;
  x = Math.min(x, Rows * cellWidth);
  y = Math.min(y, Column * cellHeight);
  var cell = new Cell(Math.floor(y/cellHeight), Math.floor(x/cellWidth));
  return cell;
}
function onClick(e) {
  // Eseménykezelő 
  if(draw == 1){ //írási jog vizsgálata
    var cell = getCursorPosition(e); //  kurzor pozició megállapítása
	//Sejtek felrajzolása és az értékek felvitele az Array-be
	ctx.fillRect(cell.column*cellWidth,cell.row*cellHeight,cellWidth,cellWidth); // akkora Sejteket rajzolunk mint a cella
    ctx.stroke();
    table[cell.row + 1][cell.column + 1] = 1;
	//Maximálisan használt terület indexének dokumentálása, csak addig fogjuk vizsgálni később a mezőket ameddig biztos van bennük Sejt
	if(cell.row > maxRow){
	  maxRow = cell.row;
	}
	if(cell.column > maxColumn){
	  maxColumn = cell.column;
	}
  }
}
function moveUp(){
  if(canvasMaxRow-60>0){ //ha nem megyünk ki az Arrayből akkor csökkentjük az aktuálisan látható intervallum sor indexét
    canvasMaxRow -= 1;
    drawTable();
  }
}
function moveLeft(){
  if(canvasMaxColumn-80>0){ //ha nem megyünk ki az Arrayből akkor csökkentjük az aktuálisan látható intervallum oszlop indexét
    canvasMaxColumn -= 1;
    drawTable();
  }	
}
function moveRight(){
  if(canvasMaxColumn+1<Column){ //ha nem megyünk ki az Arrayből akkor növeljük az aktuálisan látható intervallum oszlop indexét
    canvasMaxColumn += 1;
    drawTable();
  }
}
function moveDown(){
  if(canvasMaxRow+1<Rows){ //ha nem megyünk ki az Arrayből akkor növeljük az aktuálisan látható intervallum sor indexét
    canvasMaxRow  += 1;
    drawTable();
  }
}
function make2DArray(cols, rows) {
  // 2 dimenziós Array létrehozása
  var array = new Array(cols + 2);
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(rows + 2);
  }
  return array;
}
function countNeighbours(i,j){
  var countN = 0;
  // szomszédos mezők vizsgálata ha 1-es (aktív sejt) vagy 2-es (elhaló sejt) értéket talál akkor növeljük a számlálót 
  if(table[j][i-1] == 1 || table[j][i-1] == 2){countN++;}
  if(table[j][i+1] == 1 || table[j][i+1] == 2){countN++;}
  if(table[j-1][i-1] == 1 || table[j-1][i-1] == 2){countN++;}
  if(table[j-1][i] == 1 || table[j-1][i] == 2){countN++;}
  if(table[j-1][i+1] == 1 || table[j-1][i+1] == 2){countN++;}
  if(table[j+1][i-1] == 1 || table[j+1][i-1] == 2){countN++;}
  if(table[j+1][i] == 1 || table[j+1][i] == 2){countN++;}
  if(table[j+1][i+1] == 1 || table[j+1][i+1] == 2){countN++;}
  
  return countN;
}
function killOrborn(){
  // Döntés születésről vagy halálról
  var count; 
  for(var i = 1; i < maxColumn + 2; i++){
    for(var j = 1; j < maxRow + 2; j++){ 
      count=countNeighbours(i,j); // szomszédok számának lekérdezése
      if(table[j][i] == 1){ // akkor vizsgáljuk ha van sejt a mezőben
        if (count < 2 || count > 3){ 
          table[j][i] = 2; // ha elszigetelődés(<2) vagy túlnépesedése(>3) van akkor 2-re állítjuk az értéket 
        }
      }
      else if(count == 3){
        table[j][i] = 3; // ha pontosan 3 szomszéd van, akkor születik egy új sejt, a mező megkapja az 1-es értéket
        if(j >= maxRow){
          maxRow++; // A maximálisan használt sorok számának növelése, erre azért van szükség mert a szaporodással a játékos által felvett sejteknél nagyobb területen lehetnek sejtek
        }
        if(i >= maxColumn){
          maxColumn++; // maximálisan használt oszlopok növelése hasonló okból
        }
      }
    }
  }   
}
function changheArray(){
  //Array tisztázása
  for(var i = 1; i < maxColumn+2; i++){
    for(var j = 1; j < maxRow+2; j++){
      if(table[j][i] == 2){ // elhaló elem
        table[j][i] = 0; // Teljesül a halál feltétel ezért 0-ára(nincs sejt) állítjuk az Array mezejét
      }
      else if(table[j][i] == 3){ // születő elem
        table[j][i] = 1; // Teljesül a születés feltétel ezért 1-esre(van sejt) állítjuk az Array mezőjét
	  }
    }
  }
}
function drawTable(){
  // Sejtek eltűntetése és felrajzolása a vászonra
  for(var i =canvasMaxColumn-79; i < canvasMaxColumn+1; i++){
    for(var j = canvasMaxRow-59; j < canvasMaxRow+1; j++){
	  if(table[j][i] == 1){
		ctx.fillStyle = "#000000" // ha 1-es van akkor ott van sejt tehát felrajzoljuk
		ctx.fillRect(i*cellWidth-((canvasMaxColumn-79)*cellWidth),j*cellHeight-((canvasMaxRow-59)*cellHeight),cellWidth,cellHeight);
        ctx.stroke();
	  }
	  else if(table[j][i] != 1){
		ctx.fillStyle = "#FFFFFF" // ha 0 akkor ott nincs sejt ezért elfedjük a korábbi a rajzokat
        ctx.fillRect(i*cellWidth-((canvasMaxColumn-79)*cellWidth),j*cellHeight-((canvasMaxRow-59)*cellHeight),cellHeight,cellHeight);
        ctx.stroke();
	  }
	}
  }
}
function startAlgo(){
  draw = 0; //megvonjuk az eseménykezelőtől a rajzolási jogot
  document.getElementById("myButton2").childNodes[0].nodeValue=
  "Következő Lépés!";
    killOrborn(); //Születések halálozások megállapítása
    changheArray(); // Értékek fixálása
    drawTable(); // Sejtek felrajzolása
}
function startGame(){
  //Létrehozzuk a rajzvásznat
  canvasElement = document.createElement("canvas");
  canvasElement.id = "gof_canvas";
  document.body.appendChild(canvasElement);
  //Rajzvászon területének beállítás
  canvasElement.width = 800;
  canvasElement.height = 600;
  //Eseménykezelő és a rajzvászon beállítása
  canvasElement.addEventListener("click", onClick, false);
  ctx = canvasElement.getContext("2d");
  // 2 Dimenziós Array létrehozása
  table = make2DArray(Rows,Column);
}