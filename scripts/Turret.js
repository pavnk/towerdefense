class Turret {
    constructor(type, health,startX, startY){
        this.type = type;
        this.health = health;
        this.x = startX;
        this.y = startY;
        this.dir=1;
        this.lastShotmls = 0;
        this.cost=50;
        this.isActive=false;
        this.image = new Image;
        this.image.src = "../tureta3.png";
    }
    update(ctx){
        if(this.isActive)
            this.shoot();
        ctx.save();

        ctx.translate(this.x,this.y);
        ctx.rotate(this.dir);

        ctx.translate(-this.image.width/2,-this.image.height/2);
        ctx.drawImage(this.image, 0, 0);

        ctx.restore();
    }
    findEnemy(){
        let closestEnemyIndex=-1;
        let closesEnemyDistance= Number.MAX_SAFE_INTEGER;
        for(let i = 0; i < entities.length; i++){
            if(entities[i] instanceof Enemy){
                const distance = calculateDistance(this.x,this.y,entities[i].x,entities[i].y);
                if(distance < closesEnemyDistance){
                    closesEnemyDistance = distance;
                    closestEnemyIndex = i;
                }
            }
        }
        return closestEnemyIndex;
    }
    shoot(){
        if(Date.now() - this.lastShotmls > 500){
            const closestEnemyIndex = this.findEnemy();
            if(closestEnemyIndex === -1){
                return;
            }
            const closestEnemy = entities[closestEnemyIndex];
            const closestAngle = angle(this.x,this.y,closestEnemy.x,closestEnemy.y);
            entities.push(new Bullet(this.x,this.y,closestAngle,10));
            this.lastShotmls = Date.now();
            this.dir = closestAngle;
        }
    }
}
