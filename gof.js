const SIZE = 1000; // A pálya mérete
const CELL_SIZE = 12; // Cella méret szegélyel

const CANVAS_CELL_COUNT = 25; // Egyszere ábrázolt sorok/oszlopok száma
const CANVAS_SIZE = CANVAS_CELL_COUNT*CELL_SIZE-2; // Canvas mérete

var maxRow = 0; // A felvett korongok legnagyobb sorindexe, eddig fogjuk vizsgálni majd a Tömböt
var maxColumn = 0; // A felvett korongok legnagyobb oszlopindexe, eddig fogjuk vizsgálni a Tömböt

var canvasMaxRow = 25; // Az aktuálisan látható mátrix legnagyobb sor indexe
var canvasMaxColumn = 25;  // Az aktuálisan látható mátrix legnagyobb oszlop indexe

var draw = 1; // A user joga a rajzolásra, ha elindul az algoritmus akkor 0-ára állítjuk és csak az algoritmus rajzolhat
var run = 1; // Interval gyorsítás gátló

function startGame(){
  // Létrehozzuk a rajzvásznat
  canvasElement = document.createElement("canvas");
  canvasElement.id = "gof_canvas";
  document.body.appendChild(canvasElement);
  // Rajzvászon területének beállítás
  canvasElement.width = CANVAS_SIZE;
  canvasElement.height = CANVAS_SIZE;
  // Eseménykezelő és a rajzvászon beállítása
  canvasElement.addEventListener("click", onClick, false);
  ctx = canvasElement.getContext("2d");
  // 2 Dimenziós tömb létrehozása
  table = make2DArray(SIZE);
}
function make2DArray(size) {
  // 2 dimenziós Array létrehozása
  var array = new Array(size + 2);
  for (var i = 0; i < array.length; i++) {
    array[i] = new Array(size + 2);
  }
  return array;
}
function Cell(row, column){
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
  x = Math.min(x, SIZE * CELL_SIZE);
  y = Math.min(y, SIZE * CELL_SIZE);
  var cell = new Cell(Math.floor(y/CELL_SIZE), Math.floor(x/CELL_SIZE));
  return cell;
}
function onClick(e){
  // Kattintás eseménykezelő
  if(draw == 1){ // Írási jog vizsgálata, ha nincs nem csinálunk semmit
    var cell = getCursorPosition(e); // Megállapítjuk a kurzor koordinátáit
	if(table[cell.row + 1][cell.column + 1] !=1 ){ // Ha még nincs a cellában felvéve korong akkor felveszük,
                                                   //	egyébként ha már volt akkor nem csinálunk semmit
	  table[cell.row + 1][cell.column + 1] = 1; // Felveszük az 1-es értéket a cellába, ami azt jelöli hogy van sejt
	  drawCircle(cell.row,cell.column);
	}
  }
  // Maximálisan használt sorindex eltárolása
  if(cell.row > maxRow){
    maxRow = cell.row;
  }
  // Maximálisan használt oszlopindex eltárolása
  if(cell.column > maxColumn){
    maxColumn = cell.column;
  }
}
// Rajzolásért felelős Függvények
function drawLine(){
  ctx.clearRect(0,0,298,298);
  for(var x=11; x<298 ;x+=12){ 
    ctx.beginPath(); // resetelni kell a definiált alakzatokat hogy ne rajzoljunk fel semmit amit nem akarunk
    ctx.moveTo(0,x); // vízszintes vonalak 
    ctx.lineTo(298,x);
    ctx.moveTo(x,0); // függöleges vonalak
    ctx.lineTo(x,298);
	ctx.stroke();
  }
}
function drawCircle(x,y){
  // Korong felrajzolása az x y koordináta alapján
  ctx.beginPath();
  // Alapvetően a koordináta * cella magasság/szélességel számoljuk hogy hova kell kerülnie a korongnak
  // Hozzá kell adni +5-t hogy a cella közepére kerüljön a korong
  // A további számítások azért szükségek hogy akkor is pontosan ábrázolhasuk a sejteket amikor nem az első indexektől rajzoljuk ki a táblát
  ctx.arc((y*CELL_SIZE+5)-((canvasMaxColumn-CANVAS_CELL_COUNT)*CELL_SIZE),(x*CELL_SIZE+5)-((canvasMaxRow-CANVAS_CELL_COUNT)*CELL_SIZE) , 4, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}
// A tömbben való mozgásért felelős függvények amik a felület irány gombjaira reagálnak
function moveUp(){
  if(canvasMaxRow-CANVAS_CELL_COUNT>0){ //ha nem megyünk ki az Arrayből akkor csökkentjük az aktuálisan látható intervallum sor indexét
    canvasMaxRow -= 1;
    drawTable(); // Felrajzoljuk a táblát
  }
}
function moveLeft(){
  if(canvasMaxColumn-CANVAS_CELL_COUNT>0){ //ha nem megyünk ki az Arrayből akkor csökkentjük az aktuálisan látható intervallum oszlop indexét
    canvasMaxColumn -= 1;
    drawTable(); // Felrajzoljuk a táblát
  }	
}
function moveRight(){
  if(canvasMaxColumn+1<SIZE){ //ha nem megyünk ki az Arrayből akkor növeljük az aktuálisan látható intervallum oszlop indexét
    canvasMaxColumn += 1;
    drawTable(); // Felrajzoljuk a táblát
  }
}
function moveDown(){
  if(canvasMaxRow+1<SIZE){ //ha nem megyünk ki az Arrayből akkor növeljük az aktuálisan látható intervallum sor indexét
    canvasMaxRow  += 1;
    drawTable(); // Felrajzoljuk a táblát
  }
}
// Algoritmus kezelése
function start(){
  draw = 0; // Megvonjuk az eseménykezelőtől a rajzolási jogot
  if(run == 1){ // ha még nem állítotunk be Intervalt akkor fut le
    add = setInterval(main,1000); // 1 másodpercenként futtatjuk a main függvényt, amíg a STOP gomb nem reseteli az add változót
	run = 0; // futási jog tiltása
  }
}
function stop(){
	run = 1; // futási jog megadása
	clearInterval(add); // add változó resetelése
}
function main(){
	draw=0; // Megvonjuk az eseménykezelőtől a rajzolási jogot
	killOrborn(); //Születések halálozások megállapítása
    changheArray(); // Értékek tisztázása
    drawTable(); // Tábla felrajzolása
}
// Az algoritmus működéséhez szükséges függvények
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
      count=countNeighbours(i,j); // Szomszédok számának lekérdezése
      if(table[j][i] == 1){ // Akkor vizsgáljuk ha van sejt a mezőben
        if (count < 2 || count > 3){ 
          table[j][i] = 2; // Ha elszigetelődés(<2) vagy túlnépesedése(>3) van akkor 2-re állítjuk az értéket 
        }
      }
      else if(count == 3){
        table[j][i] = 3; // Ha pontosan 3 szomszéd van, akkor születik egy új sejt, a mező megkapja az 1-es értéket 
		                 //( it még csak 3-ast, hogy ne zavarjon bele a többi vizsgálatba)
        if(j >= maxRow){
          maxRow++; // A maximálisan használt sorok számának növelése,
		            //erre azért van szükség mert a szaporodással a játékos által felvett sejteknél nagyobb területen lehetnek sejtek
        }
        if(i >= maxColumn){
          maxColumn++; // Maximálisan használt oszlopok növelése hasonló okból
        }
      }
    }
  }   
}
function changheArray(){
  //Array tisztázása
  for(var i = 1; i < maxColumn+2; i++){
    for(var j = 1; j < maxRow+2; j++){
      if(table[j][i] == 2){ // Elhaló elem
        table[j][i] = 0; // Teljesül a halál feltétel ezért 0-ára(nincs sejt) állítjuk az Array mezejét
      }
      else if(table[j][i] == 3){ // Születő elem
        table[j][i] = 1; // Teljesül a születés feltétel ezért 1-esre(van sejt) állítjuk az Array mezőjét
	  }
    }
  }
}
function drawTable(){
  // Tábla felrajzolása 
  drawLine(); // Keret felrajzolása
  for(var i =canvasMaxColumn-24; i < canvasMaxColumn+1; i++){
    for(var j = canvasMaxRow-24; j < canvasMaxRow+1; j++){
	  if(table[j][i] == 1){ // Korongok felrajzolása ott ahol a tömbben elvan tárolva 
		drawCircle(j-1,i-1);
	  }
	}
  }
}