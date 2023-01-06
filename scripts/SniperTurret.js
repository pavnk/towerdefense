
class SniperTurret extends Turret {
    constructor(type, health,startX, startY){
        super(type, health,startX, startY);
        this.damage = 200;
        this.image.src = "../img/tureta1.png";
    }
    shoot(){
        if(Date.now() - this.lastShotmls > 2000){
            const closestEnemyIndex = this.findEnemy();
            if(closestEnemyIndex === -1){
                return;
            }
            const closestEnemy = entities[closestEnemyIndex];
            const closestAngle = angle(this.x,this.y,closestEnemy.x,closestEnemy.y);
            entities.push(new SniperBullet(this.x,this.y,closestAngle,10));
            this.lastShotmls = Date.now();
            this.dir = closestAngle;
        }
    }
}