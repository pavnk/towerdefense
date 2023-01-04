
class BasicTurret extends Turret {
    constructor(type, health,startX, startY){
        super(type, health,startX, startY);
        this.cost = 50;
        this.image.src = "../tureta3.png";
    }
}