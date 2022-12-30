class Enemy {
    constructor(type, health, speed, startX, startY){
        this.type = type;
        this.health = health;
        this.speed = speed;
        this.x = startX;
        this.y = startY;
        this.dir=1;
        this.image = new Image;
        this.image.src = "../tureta1.png";
        this.currentWaypoint=1;
    }
    update(ctx, route){
        this.updateWaypoint(route);
        ctx.save();

        ctx.translate(this.x,this.y);
        ctx.rotate(this.dir);

        ctx.translate(-this.image.width/2,-this.image.height/2);
        ctx.drawImage(this.image, 0, 0);

        ctx.restore();
        console.log(this.health);
    }
    updateWaypoint(route){
        const distance = calculateDistance(this.x,this.y, route[this.currentWaypoint].x,route[this.currentWaypoint].y);
        if(distance<1 && this.currentWaypoint<route.length-1){
            this.currentWaypoint++;
        }
        this.dir=angle(this.x,this.y,route[this.currentWaypoint].x,route[this.currentWaypoint].y);
        this.x=this.x+Math.cos(this.dir)*this.speed;
        this.y=this.y+Math.sin(this.dir)*this.speed;
    }
    onDamage(damage){
        this.health -= damage;
        if(this.health <= 0){
            this.onDestroy();
        }
    }
    onDestroy(){
        let total = parseInt(money.innerText,10);
        total += 20;
        money.innerText = total.toString();
        entities.splice(findMyself(this),1);
        console.log("dead");
    }
}