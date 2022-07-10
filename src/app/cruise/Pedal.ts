import { Renderer2 } from "@angular/core";

export class Pedal{

  private img;
  private aPath;
  private bPath;
  private bX = 200;
  private bY = 400;
  private aX = 400;
  private aY = 400;
  private bW = 100;
  private bH = 200;
  private aW = 100;
  private aH = 200;
  break = false;
  gas = false;

  private strokeStyle = 'black';
  private lineWidth = 8;
  private unListenMouseUp: () => void;

  constructor(private ctx: CanvasRenderingContext2D, private renderer2:Renderer2) {
    this.img = new Image();
    this.img.src =
      // 'https://cdn-icons.flaticon.com/png/512/2087/premium/2087078.png?token=exp=1657170801~hmac=a6a562a03756055ad695a780f2ae2797';
      'assets/breakpedal.jpg'
    this.aPath = new Path2D();
    this.bPath = new Path2D();
    this.aPath.rect(this.aX , this.aY , this.aW, this.aH);
    this.bPath.rect(this.bX , this.bY , this.bW, this.bH);
    this.ctx.strokeStyle=this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
  }

  public isClicked(x, y){
    if (this.ctx.isPointInPath(this.bPath, x, y)) {
      console.log("clicked");
      this.break = true;
      this.unListenMouseUp = this.renderer2.listen(this.ctx.canvas, "mouseup", event => {
        this.break = false;
        this.unListenMouseUp();
        console.log("break");
      });
    } else if(this.ctx.isPointInPath(this.aPath, x, y)){
      this.gas = true;
      this.unListenMouseUp = this.renderer2.listen(this.ctx.canvas, "mouseup", event => {
        this.gas = false;
        this.unListenMouseUp();
        console.log("gas");
      });
    }
  }

  public draw() {
    this.drawBreak();
    this.drawGas();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawGas(){
    if(this.gas){
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    }else{
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(this.img, 0, 0, this.img.width/2, this.img.height-80, this.aX, this.aY, this.aW, this.aH);
  }
  private drawBreak(){
    if(this.break){
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    }else{
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(this.img, this.img.width/2, 0, this.img.width/2,this.img.height-80, this.bX, this.bY, this.bW, this.bH);
  }
}

