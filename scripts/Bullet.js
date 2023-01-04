class Bullet {
    constructor(startX, startY,dir,speed){
        this.speed = speed;
        this.x = startX;
        this.y = startY;
        this.dir=dir;
        this.damage = 50;
    }
    update(ctx, route){
        this.x=this.x+Math.cos(this.dir)*this.speed;
        this.y=this.y+Math.sin(this.dir)*this.speed;
        fillCircle(this.x,this.y,10,"white");
        this.checkDestroy();
    }

    checkDestroy(){
        if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height){
            entities.splice(findMyself(this),1);
        }
        for(let i = 0; i < entities.length; i++){
            if(entities[i] instanceof Enemy){
                const distance = calculateDistance(this.x,this.y,entities[i].x,entities[i].y);
                if(distance<10){
                    entities[i].onDamage(this.damage);
                    entities.splice(findMyself(this),1);
                }
            }
        }
    }
}