let canvas;
const OFFSET = 50;


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

function initGame(difficulty) {
    const request = new XMLHttpRequest();
    request.open("GET", "./levels.json", false);
    request.send();
    const levels = JSON.parse(request.responseText);

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";
    let level;
    if (difficulty === 1) {
        level = Math.floor(Math.random() * LEVELS);
        var route = levels.difficulty.easy[level];
        console.log(route);
        drawBoard(route);
    }
}

function drawBoard(route) {
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
        console.log(i);

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

function drawLine(stPoint, endPoint, color) {
    const ctx = canvas.getContext('2d');
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
    drawLine(new Point(firstX, firstY), new Point(secondX, secondY), "blue");
    drawLine(new Point(firstX, firstY + OFFSET), new Point(secondX, secondY + OFFSET), "blue");
}

function drawVertical(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX, firstY), new Point(secondX, secondY), "blue");
    drawLine(new Point(firstX+OFFSET, firstY), new Point(secondX+OFFSET, secondY), "blue");
}

function drawFromUpToRight(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY), new Point(firstX,firstY+OFFSET), "blue");
    drawLine(new Point(firstX,firstY+OFFSET), new Point(firstX+OFFSET,firstY+OFFSET), "blue");
}

function drawFromUpToLeft(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX+OFFSET,firstY),new Point(firstX+OFFSET,firstY+OFFSET),"blue");
    drawLine(new Point(firstX,firstY+OFFSET),new Point(firstX+OFFSET,firstY+OFFSET),"blue");
}

function drawFromBottomToRight(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY),new Point(firstX,firstY+OFFSET),"blue");
    drawLine(new Point(firstX,firstY),new Point(firstX+OFFSET,firstY),"blue");
}

function drawFromBottomToLeft(firstX, firstY, secondX, secondY){
    drawLine(new Point(firstX,firstY),new Point(firstX+OFFSET,firstY),"blue");
    drawLine(new Point(firstX+OFFSET,firstY),new Point(firstX+OFFSET,firstY+OFFSET),"blue");
}

drawMenu();