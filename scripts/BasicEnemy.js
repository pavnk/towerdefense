class BasicEnemy extends Enemy {
    constructor(type, health, speed, startX, startY) {
        super(type, health, speed, startX, startY);
        this.image.src = "../img/robot2.png";
        this.damageToBase = 5;
        this.reward = 10;
    }

}