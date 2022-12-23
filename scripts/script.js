function drawMenu(){
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

function drawLevelSelection(){
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

function initGame(difficulty){
    const request = new XMLHttpRequest();
    request.open("GET", "./levels.json", false);
    request.send();
    const levels = JSON.parse(request.responseText);

    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = "black";
    let level;
    if(difficulty===1){
        level = Math.floor(Math.random() * LEVELS);
    }
}
drawMenu();