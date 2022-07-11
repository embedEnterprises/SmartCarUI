import { Renderer2 } from '@angular/core';

export class Steering {
  private posX = 1100;
  private posY = 500;
  public rotation = 0;
  private diameter = 300;
  private strokeStyle = 'black';
  private lineWidth = 8;
  private img;
  private path;
  private unListenMouseMove: () => void;
  private unListenMouseUp: () => void;
  private intervalId;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer2: Renderer2
  ) {
    this.img = new Image();
    this.img.src =
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Steering-wheel.svg';
    // 'assets/steer.svg';
    this.path = new Path2D();
  }

  public isClicked(x: number, y: number) {
    if (this.ctx.isPointInPath(this.path, x, y)) {
      var prevRad = Math.atan2(y - this.posY, x - this.posX);
      var rad;
      this.unListenMouseMove = this.renderer2.listen(
        this.ctx.canvas,
        'mousemove',
        (event) => {
          x = event.offsetX;
          y = event.offsetY;
          rad = Math.atan2(y - this.posY, x - this.posX);
          if (prevRad < 0 && rad > 0) {
            this.rotation -= Math.abs(Math.abs(rad) - Math.abs(prevRad));
          } else if (prevRad > 0 && rad < 0) {
            this.rotation += Math.abs(Math.abs(rad) - Math.abs(prevRad));
          } else {
            this.rotation += rad - prevRad;
          }
          prevRad = rad;
        }
      );

      this.unListenMouseUp = this.renderer2.listen(
        this.ctx.canvas,
        'mouseup',
        (event) => {
          this.resetSteering();
          this.unListenMouseMove();
          this.unListenMouseUp();
        }
      );
    }
  }

  public update() {
    this.draw();
  }

  private resetSteering() {
    if (this.rotation != 0) {
      this.intervalId = setInterval(() => {
        this.resetPos();
      }, 1);
    }
  }

  public resetPos() {
    if (this.rotation > Math.PI/180) {
      this.rotation -= Math.PI / 180;
    } else if (this.rotation < -Math.PI/180) {
      this.rotation += Math.PI / 180;
    } else {
      this.rotation = 0;
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
    console.log("a- " , this.rotation * 180/Math.PI);
  }

  public draw() {
    this.ctx.setTransform(1, 0, 0, 1, this.posX, this.posY);
    this.ctx.rotate(this.rotation);
    this.ctx.drawImage(
      this.img,
      -this.diameter / 2,
      -this.diameter / 2,
      this.diameter,
      this.diameter
    );
    this.ctx.rotate(0);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.path.arc(
      this.posX,
      this.posY,
      this.diameter / 2,
      0,
      2 * Math.PI,
      true
    );
    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    // this.ctx.stroke(this.path);
  }
}
