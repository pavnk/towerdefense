class BasicTurret extends Turret {
    constructor(type, health,startX, startY){
        super(type, health,startX, startY);
        this.damage = 25;
        this.image.src = "../img/tureta3.png";
    }
}