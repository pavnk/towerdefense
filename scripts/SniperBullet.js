class SniperBullet extends Bullet {
    constructor(startX, startY,dir,speed){
        super(startX, startY,dir,speed);
        this.damage = 50;
    }
}