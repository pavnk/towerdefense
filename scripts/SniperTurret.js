
class SniperTurret extends Turret {
    constructor(type, health,startX, startY){
        super(type, health,startX, startY);
        this.cost = 100;
        this.image.src = "../tureta1.png";
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