let canvas;
const OFFSET = 50;

let ctx;
let level;
let route=[];

let mouseX;
let mouseY;

let money;

let baseHP;

let lastSpawnMls = 0;

const basicTurretCost = 100;
const sniperTurretCost = 200;

let currentTurret=null;

let killedEnemies = 0;

let entities=[];

let waves=[];

let enemyIndex = 0;

let waveIndex = 0;

let stopSpawn = false;

let gameEndStatus = 0;

function initVars(){
    canvas = null;
    ctx = null;
    level = null;
    route.splice(0,route.length);
    mouseX=0;
    mouseY=0;
    lastSpawnMls = 0;
    currentTurret = null;
    killedEnemies = 0;
    entities.splice(0,entities.length);
    waves.splice(0,waves.length);
    enemyIndex=0;
    waveIndex=0;
    stopSpawn=false;
    gameEndStatus=0;
}

//draw menu buttons and background
function drawMenu() {

    initVars();

    createModal('Help');

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
        modalButton.remove();
        drawLevelSelection();
    }
    document.body.style.backgroundImage = "url('../img/robotdefense.png')";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundSize = "cover";
    document.body.appendChild(button);
}

//draw buttons for level selection
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

const LEVELCOUNT = 5;

//draw in game HUD and listeners for turret placement
function drawBuyMenu() {
    const hpText = document.createElement("span");
    hpText.innerText = "Život";
    hpText.style.position = "fixed";
    hpText.style.top = "2%";
    hpText.style.left = "50%";
    hpText.style.color = "white";
    document.body.appendChild(hpText);

    baseHP = document.createElement("span");
    baseHP.innerText="100";
    baseHP.style.position = "fixed";
    baseHP.style.top = "4%";
    baseHP.style.left = "50%";
    baseHP.style.color = "white";
    document.body.appendChild(baseHP);

    const moneyText = document.createElement("span");
    moneyText.innerText = "Peniaze";
    moneyText.style.position = "fixed";
    moneyText.style.top = "2%";
    moneyText.style.left = "90%";
    moneyText.style.color = "white";
    document.body.appendChild(moneyText);

    money = document.createElement("span");
    money.innerText="100";
    money.style.position = "fixed";
    money.style.top = "4%";
    money.style.left = "90%";
    money.style.color = "white";
    document.body.appendChild(money);

    const button = document.createElement('button');
    button.innerText = "Základný turret "+basicTurretCost+ " $";
    button.style.width = "100px";
    button.style.height = "50px";
    button.style.position = "fixed";
    button.style.top = "6%";
    button.style.left = "90%";
    button.addEventListener("mousedown", function () {
        let total = parseInt(money.innerText,10);
        if(total >= basicTurretCost) {
            total -= basicTurretCost;
            money.innerText = total.toString();
            currentTurret = new BasicTurret("normal", 100, mouseX, mouseY);
            entities.push(currentTurret);
        }
    });
    document.body.appendChild(button);

    const button2 = document.createElement('button');
    button2.innerText = "Sniper turret "+sniperTurretCost+ " $";
    button2.style.width = "100px";
    button2.style.height = "50px";
    button2.style.position = "fixed";
    button2.style.top = "12%";
    button2.style.left = "90%";
    button2.addEventListener("mousedown", function () {
        let total = parseInt(money.innerText,10);
        if(total >= sniperTurretCost) {
            total -= sniperTurretCost;
            money.innerText = total.toString();
            currentTurret = new SniperTurret("sniper", 100, mouseX, mouseY);
            entities.push(currentTurret);
        }
    });
    document.body.appendChild(button2);
}

//parse json file with level info
function initGame(difficulty) {
    const request = new XMLHttpRequest();
    request.open("GET", "./levels.json", false);
    request.send();
    const levels = JSON.parse(request.responseText);

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "white";

    canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width  = window.innerWidth-2;
    canvas.height = window.innerHeight-6;
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
        generateLevel();

        for(let i=0; i<levels.difficulty.easy[level].length;i++){
            if(i<3){
                waves.push(levels.difficulty.easy[level][i]);
            }
            else
                route.push(levels.difficulty.easy[level][i]);
        }
    }
    else if(difficulty === 2){
        generateLevel();
        for(let i=0; i<levels.difficulty.medium[level].length;i++){
            if(i<3){
                waves.push(levels.difficulty.medium[level][i]);
            }
            else
                route.push(levels.difficulty.medium[level][i]);
        }
    }

    for(let i = 0; i < route.length; i++){
        route[i].x = route[i].x / 1918 * canvas.width;
        route[i].y = route[i].y / 945 * canvas.height;
    }

    window.requestAnimationFrame(gameLoop);
}

//randomized selection of levels, without repeating saved in browser
function generateLevel(){
    let flagCount=0;
    for(let i=0; i<LEVELCOUNT; i++){
        if(localStorage.getItem(i.toString())==="exists")
            flagCount++;
    }
    if(flagCount===5)
        localStorage.clear();

    while(true){
        level = Math.floor(Math.random() * LEVELCOUNT);
        if(localStorage.getItem(level)==="exists")
            continue;
        else{
            localStorage.setItem(level,"exists");
            return;
        }
    }
}

//main loop and check for finished round
function gameLoop(){
    checkGameEnd();
    if(gameEndStatus===1){
        gameFinished("PREHRA");
        return;
    }
    else if(gameEndStatus===2){
        gameFinished("VÝHRA");
        return;
    }
    spawnEnemies();
    draw();

    window.requestAnimationFrame(gameLoop);
}

//modal for help button
function createModal(buttonText) {
    // Create the button
    modalButton = document.createElement('button');
    modalButton.textContent = buttonText;

    // Create the modal
    const modal = document.createElement('div');
    modal.style.display = 'none';
    modal.id = 'my-modal';  // Assign an ID to the modal

    modal.style.color = "white";

    // Create a new paragraph element
    const p = document.createElement('p');

    // Set the text content of the paragraph
    p.textContent = 'Hráč si môže vybrať z dvoch obtiažností, Ľahka alebo Stredná.';
    //const br = document.createElement('br');
    //p.appendChild(br);
    p.textContent += 'Vpravo hore má hráč starting currency. Za zničenie nepriateľov dostáva hráč currency a môže tak kupovať ďaľšie turrety.';

    // Append the paragraph to the modal
    modal.appendChild(p);


    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    modal.appendChild(closeButton);

    // Append the button and modal to the page
    document.body.appendChild(modalButton);
    document.body.appendChild(modal);

    // Open button
    modalButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Close button
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    modalButton.style.position = 'fixed';
    modal.style.position = 'fixed';

    modalButton.style.width = "300px";
    modalButton.style.height = "50px";
    modalButton.style.position = "fixed";
    modalButton.style.top = "60%";
    modalButton.style.left = "50%";
    modalButton.style.marginLeft = "-150px";
    modalButton.style.marginTop = "-25px";

    closeButton.style.width = "150px";
    closeButton.style.height = "30px";
    closeButton.style.position = "fixed";
    closeButton.style.top = "70%";
    closeButton.style.left = "54%";
    closeButton.style.marginLeft = "-150px";
    closeButton.style.marginTop = "-25px";

    modal.style.position = "fixed";
    modal.style.top = "62%";
    modal.style.left = "70%";
    modal.style.marginLeft = "-150px";
    modal.style.marginTop = "-25px";

    modalButton.onclick = () => {
        modalButton.remove();
    }

}

//check for base health and if all enemies are dead
function checkGameEnd(){
    let hp = parseInt(baseHP.innerText,10);
    if(hp<=0){
        hp = 0;
        baseHP.innerText = hp.toString();
        gameEndStatus=1;
    }
    if(stopSpawn){
        for(let i = 0; i < entities.length; i++) {
            if (entities[i] instanceof Enemy) {
                return;
            }
        }
        gameEndStatus=2;
    }
}

//modal for finished game
function gameFinished(resultText){
    let modal = document.createElement("div");
    let modalContent = document.createElement("div");

    modal.style.display = "none";
    modal.style.position = "fixed";
    modal.style.zIndex = "1";
    modal.style.left = "0";
    modal.style.top = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.overflow = "auto";
    modal.style.backgroundColor = "rgba(0,0,0,0.4)";

    modalContent.style.backgroundColor = "#fefefe";
    modalContent.style.margin = "15% auto";
    modalContent.style.padding = "20px";
    modalContent.style.border = "1px solid #888";
    modalContent.style.width = "50%";

    const title = document.createElement("span");
    title.innerText = resultText;
    modalContent.appendChild(title);

    modalContent.appendChild(document.createElement("br"));

    const statKills = document.createElement("span");
    statKills.innerText = "Počet zabitých nepriateľov: " + killedEnemies.toString();
    modalContent.appendChild(statKills);

    modalContent.appendChild(document.createElement("br"));

    const statHP = document.createElement("span");
    statHP.innerText = "Počet tvojich životov: " + baseHP.innerText;
    modalContent.appendChild(statHP);

    modalContent.appendChild(document.createElement("br"));

    const buttonMenu = document.createElement("button");
    buttonMenu.style.width = "300px";
    buttonMenu.style.height = "50px";
    buttonMenu.innerText = "Návrat do menu";
    buttonMenu.onclick = () => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        drawMenu();
    }
    modal.style.display = "block";
    modalContent.appendChild(buttonMenu);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

let waveDelay = 0;

//spawn enemies in waves, marta is boss
function spawnEnemies(){
    if(stopSpawn)
        return;
    if(Date.now() - lastSpawnMls > 1500 + waveDelay){
        waveDelay=0;
        let enemy
        if(waves[waveIndex][enemyIndex] === 1) {
            enemy = new BasicEnemy("normal", 100, 1, route[0].x, route[0].y);
        }
        else if(waves[waveIndex][enemyIndex] === 2) {
            enemy = new TankEnemy("tank", 150, 1, route[0].x, route[0].y);
        }
        else if(waves[waveIndex][enemyIndex] === 3) {
            enemy = new BossEnemy("marta", 500, 1, route[0].x, route[0].y);
        }
        entities.push(enemy);
        enemyIndex++;
        if(waves[waveIndex].length === enemyIndex){
            enemyIndex = 0;
            waveIndex++;
            waveDelay = 5000;
            if(waveIndex === 3)
                stopSpawn = true;
        }
        lastSpawnMls = Date.now();
    }
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

function drawBoard1() {
    for (var i = 0; i < route.length - 1; i++) {
        drawLine(new Point(route[i].x, route[i].y),new Point(route[i+1].x,route[i+1].y), "white");
    }
}

//remove health from base when enemy completes route
function updateHP(damage){
    let hp = parseInt(baseHP.innerText,10);
    hp -= damage;
    baseHP.innerText = hp.toString();
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

drawMenu();