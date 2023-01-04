class TankEnemy extends Enemy {
    constructor(type, health, speed, startX, startY) {
        super(type, health, speed, startX, startY);
        this.image.src = "../robot1.png";
        this.damageToBase = 10;
        this.reward = 50;
    }
}