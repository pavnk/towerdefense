let canvas;
const OFFSET = 50;

let ctx;
let level;
let route;

let mouseX;
let mouseY;

let money;

const turretCost = 50;

let currentTurret=null;

let entities=[];


function drawMenu() {
    const button = document.createElement("button");
    button.style.width = "300px";
    button.style.height = "50px";
    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.left = "50%";
    button.innerText = "Zvol obtiažnosť";
    button.style.marginLeft = "-150px";
    button.style.marginTop = "-25px";
    button.onclick = () => {
        button.remove();
        drawLevelSelection();
    }
    /*background-image:url('./img/robotdefense.png');
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;*/
    document.body.style.backgroundImage = "url('../img/robotdefense.png')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
    document.body.appendChild(button);
}

function drawLevelSelection() {
    const easyButton = document.createElement('button');
    easyButton.innerText = "Ľahká";
    easyButton.style.width = "300px";
    easyButton.style.height = "50px";
    easyButton.style.position = "fixed";
    easyButton.style.top = "45%";
    easyButton.style.left = "50%";
    easyButton.style.marginLeft = "-150px";
    easyButton.style.marginTop = "-25px";

    const mediumButton = document.createElement('button');
    mediumButton.innerText = "Stredná";
    mediumButton.style.width = "300px";
    mediumButton.style.height = "50px";
    mediumButton.style.position = "fixed";
    mediumButton.style.top = "55%";
    mediumButton.style.left = "50%";
    mediumButton.style.marginLeft = "-150px";
    mediumButton.style.marginTop = "-25px";

    easyButton.onclick = () => {
        easyButton.remove();
        mediumButton.remove();
        initGame(1);
    }

    mediumButton.onclick = () => {
        easyButton.remove();
        mediumButton.remove();
        initGame(2);
    }

    document.body.appendChild(easyButton);
    document.body.appendChild(mediumButton);
}

const LEVELS = 2;

function drawBuyMenu() {
    money = document.createElement("span");
    money.innerText="150";
    money.style.position = "fixed";
    money.style.top = "2%";
    money.style.left = "80%";
    document.body.appendChild(money);

    const button = document.createElement('button');
    button.innerText = "button";
    button.style.width = "100px";
    button.style.height = "50px";
    button.style.position = "fixed";
    button.style.top = "4%";
    button.style.left = "80%";
    button.addEventListener("mousedown", function () {
        let total = parseInt(money.innerText,10);
        if(total >= turretCost) {
            total -= turretCost;
            money.innerText = total.toString();
            currentTurret = new Turret("normal", 100, mouseX, mouseY);
            entities.push(currentTurret);
        }
    });
    document.body.appendChild(button);
}

function initGame(difficulty) {
    const request = new XMLHttpRequest();
    request.open("GET", "./levels.json", false);
    request.send();
    const levels = JSON.parse(request.responseText);

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";

    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.border = "1px solid";
    canvas.style.backgroundColor = "black";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');

    document.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(currentTurret){
            currentTurret.x = mouseX;
            currentTurret.y = mouseY;
        }
    });

    canvas.addEventListener("mouseup", function (e) {
        if(currentTurret){
            currentTurret.isActive=true;
            currentTurret = null;
        }
    });

    drawBuyMenu();

    if (difficulty === 1) {
        level = Math.floor(Math.random() * LEVELS);
        route = levels.difficulty.easy[level];
        //drawBoard1(route);
    }
    var enemy= new Enemy("noraml",100,0.5,route[0].x,route[0].y);
    entities.push(enemy);


    window.requestAnimationFrame(gameLoop);
}

function gameLoop(){
    draw();

    window.requestAnimationFrame(gameLoop);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard1();
    for(let i=0;i<entities.length;i++){
        entities[i].update(ctx, route);
    }
}

function calculateDistance(x1,y1,x2,y2){
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.sqrt(a * a + b * b);
}

function angle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const theta = Math.atan2(dy, dx); // range (-PI, PI]
    //theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    //if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}

function fillCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function findMyself(self){
    for(let i = 0; i<entities.length;i++){
        if(entities[i] === self){
            return i;
        }
    }
}



function drawBoard() {
    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 1200;
    canvas.height = 800;
    canvas.style.border = "1px solid";
    canvas.style.backgroundColor = "black";
    document.body.style.textAlign = "center";
    document.body.appendChild(canvas);

    for (var i = 1; i < route.length - 1; i++) {
        //TODO check for opposite directions
        //TODO draw finish and spawn

        //TODO check for last piece
        if (route[i].x < route[i + 1].x) {
            if(route[i-1].y < route[i].y){
                drawFromUpToRight(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            }
            else if(route[i-1].y > route[i].y){
                drawFromBottomToRight(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            }
            else
                drawHorizontal(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
        }
        else if (route[i].y < route[i + 1].y) {
            if (route[i].x > route[i-1].x) {
                drawFromBottomToLeft(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            } else if (route[i].x < route[i-1].x) {
                drawFromBottomToRight(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            }
            else
                drawVertical(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
        }
        else if(route[i].x > route[i + 1].x){
            if(route[i-1].y < route[i].y) {
                drawFromUpToLeft(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            } else if(route[i-1].y > route[i].y){
                drawFromBottomToLeft(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            }
            drawHorizontal(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
        }
        else if (route[i].y > route[i + 1].y) {
            if (route[i-1].x < route[i].x) {
                drawFromUpToLeft(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            } else if (route[i-1].x > route[i].x) {
                drawFromUpToRight(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
            }
            else
                drawVertical(route[i].x, route[i].y, route[i + 1].x, route[i + 1].y);
        }
    }
}

function drawBoard1() {


    for (var i = 0; i < route.length - 1; i++) {
        drawLine(new Point(route[i].x, route[i].y),new Point(route[i+1].x,route[i+1].y), "white");
    }
}


function drawLine(stPoint, endPoint, color) {
    ctx.beginPath();
    ctx.moveTo(stPoint.x, stPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

var Point = function (x, y) {
    this.x = x;
    this.y = y;
}

function drawHorizontal(firstX, firstY, secondX, secondY) {
    drawLine(new Point(firstX, firstY), new Point(secondX, secondY), "white");
    drawLine(new Point(firstX, firstY + OFFSET), new Point(secondX, secondY + OFFSET), "white");
}

function drawVertical(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX, firstY), new Point(secondX, secondY), "white");
    drawLine(new Point(firstX+OFFSET, firstY), new Point(secondX+OFFSET, secondY), "white");
}

function drawFromUpToRight(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY), new Point(firstX,firstY+OFFSET), "white");
    drawLine(new Point(firstX,firstY+OFFSET), new Point(firstX+OFFSET,firstY+OFFSET), "white");
}

function drawFromUpToLeft(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX+OFFSET,firstY),new Point(firstX+OFFSET,firstY+OFFSET),"white");
    drawLine(new Point(firstX,firstY+OFFSET),new Point(firstX+OFFSET,firstY+OFFSET),"white");
}

function drawFromBottomToRight(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY),new Point(firstX,firstY+OFFSET),"white");
    drawLine(new Point(firstX,firstY),new Point(firstX+OFFSET,firstY),"white");
}

function drawFromBottomToLeft(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY),new Point(firstX+OFFSET,firstY),"white");
    drawLine(new Point(firstX+OFFSET,firstY),new Point(firstX+OFFSET,firstY+OFFSET),"white");
}

drawMenu();