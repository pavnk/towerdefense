class BossEnemy extends Enemy {
    constructor(type, health, speed, startX, startY) {
        super(type, health, speed, startX, startY);
        this.image.src = "../img/marta.png";
        this.damageToBase = 30;
        this.reward = 50;
    }

}