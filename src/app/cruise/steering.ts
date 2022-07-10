import { Renderer2 } from '@angular/core';
export class Steering {
  private color: string = 'red';
  private posX = 1100;
  private posY = 500;
  private rotation = 0;
  private diameter = 200;
  private strokeStyle = 'black';
  private lineWidth = 8;
  private img;
  private path;
  private unListenMouseMove: () => void;
  private unListenMouseUp: () => void;

  constructor(private ctx: CanvasRenderingContext2D, private renderer2:Renderer2) {
    this.img = new Image();
    this.img.src =
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Steering-wheel.svg';
      // 'assets/steer.svg';
    this.path = new Path2D();
  }

  public isClicked(x: number, y: number) {
    if (this.ctx.isPointInPath(this.path, x, y)) {
        console.log("steering clicked");
        var prevRad = Math.atan2((y-this.posY) , (x-this.posX));
        // startRad =  startRad >0 ? startRad : 2*Math.PI + startRad;
        var prevDeg = (prevRad * (180 / Math.PI));
        var rad;

        this.unListenMouseMove = this.renderer2.listen(this.ctx.canvas, "mousemove", event => {
          x = event.offsetX;
          y = event.offsetY;
          rad = Math.atan2((y-this.posY),(x-this.posX));
          // rad = rad>0?rad:2*Math.PI + rad;
          var deg = (rad * (180 / Math.PI));
          console.log(deg-prevDeg);
          this.rotation += (rad-prevRad);
          prevRad= rad;
          prevDeg= deg;
        });

        this.unListenMouseUp = this.renderer2.listen(this.ctx.canvas, "mouseup", event => {
          this.unListenMouseMove();
          this.unListenMouseUp();
          console.log("mouseup");
        });

    } else {
      console.log("wrong point");
    }
  }

  public update() {
    this.draw();
  }

  public draw() {
    this.ctx.setTransform(1,0,0,1,this.posX,this.posY);
    this.ctx.rotate(this.rotation);
    this.ctx.drawImage(this.img, -this.diameter/2, -this.diameter/2, this.diameter, this.diameter);
    this.ctx.rotate(0);
    this.ctx.setTransform(1,0,0,1,0,0);
    this.path.arc(this.posX , this.posY , this.diameter/2 , 0 , 2*Math.PI , true);
    this.ctx.strokeStyle=this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    // this.ctx.stroke(this.path);

  }


}
