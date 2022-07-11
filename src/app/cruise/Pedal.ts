import { Renderer2 } from "@angular/core";

export class Pedal{

  private img;
  private break = {
    posX : 200,
    posY : 400,
    width : 100,
    height : 200,
    path : new Path2D(),
    pressed : false
  }
  private gas = {
    posX : 350,
    posY : 400,
    width : 100,
    height : 200,
    path : new Path2D(),
    pressed : false
  }

  private strokeStyle = 'black';
  private lineWidth = 8;
  private unListenMouseUp: () => void;

  constructor(private ctx: CanvasRenderingContext2D, private renderer2:Renderer2) {
    this.img = new Image();
    this.img.src =
      // 'https://cdn-icons.flaticon.com/png/512/2087/premium/2087078.png?token=exp=1657170801~hmac=a6a562a03756055ad695a780f2ae2797';
      'assets/breakpedal.jpg'
    this.gas.path.rect(this.gas.posX , this.gas.posY , this.gas.width, this.gas.height);
    this.break.path.rect(this.break.posX , this.break.posY , this.break.width, this.break.height);
    this.ctx.strokeStyle=this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
  }

  public isClicked(x, y){
    if (this.ctx.isPointInPath(this.break.path, x, y)) {
      this.break.pressed = true;
      this.unListenMouseUp = this.renderer2.listen(this.ctx.canvas, "mouseup", event => {
        this.break.pressed = false;
        this.unListenMouseUp();
      });
    } else if(this.ctx.isPointInPath(this.gas.path, x, y)){
      this.gas.pressed = true;
      this.unListenMouseUp = this.renderer2.listen(this.ctx.canvas, "mouseup", event => {
        this.gas.pressed = false;
        this.unListenMouseUp();
      });
    }
  }

  public update(){
    this.draw();
  }

  public draw() {
    this.drawBreak();
    this.drawGas();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawGas(){
    if(this.gas.pressed){
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    }else{
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(this.img, 0, 0, this.img.width/2, this.img.height-80, this.gas.posX , this.gas.posY , this.gas.width, this.gas.height);
  }
  private drawBreak(){
    if(this.break.pressed){
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    }else{
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/2,this.img.height-80, this.break.posX , this.break.posY , this.break.width, this.break.height);
  }
}

