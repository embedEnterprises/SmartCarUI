import { Renderer2, NgZone } from '@angular/core';
import { DeviceConfigurationService } from './../device-configuration.service';

export class Steering {
  private posX = 0;
  private posY = 0;
  private x = 85;
  private y = 70;
  public rotation = 0;
  private d = 65;
  private diameter = 300;
  private strokeStyle = 'black';
  private lineWidth = 8;
  private img;
  private path;
  private unListenMouseMove: () => void;
  private unListenMouseUp: () => void;
  private intervalId;
  private pointerId;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer2: Renderer2,
    private deviceConf: DeviceConfigurationService,
    private ngZone : NgZone
  ) {
    this.img = new Image();
    this.img.src =
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Steering-wheel.svg';
    // 'assets/steer.svg';
    this.path = new Path2D();


  }

  public calculatePos(w, h) {
    this.posX = (this.x / 100) * w;
    this.posY = (this.y / 100) * h;
    this.diameter = (this.d / 100) * h;
  }

  public isClicked(e) {
    var x = e.clientX;
    var y = e.clientY;
    var eventMove = '';
    var eventEnd = '';
    var id = 0;
    if (this.deviceConf.getDeviceType() == 'desktop') {
      eventMove = 'mousemove';
      eventEnd = 'mouseup';

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
    } else if (this.deviceConf.getDeviceType() == 'mobile') {
      eventMove = 'touchmove';
      eventEnd = 'touchend';

      if (this.ctx.isPointInPath(this.path, x, y)) {
        console.log("point in path");
        this.pointerId = e.pointerId;

        clearInterval(this.intervalId);
        var prevRad = Math.atan2(y - this.posY, x - this.posX);
        var rad;

        this.unListenMouseMove = this.renderer2.listen(
          this.ctx.canvas,
          'pointermove',
          (event) => {
            console.log("move");
            event.preventDefault();
            if(this.pointerId == event.pointerId){
              x = event.clientX;
              y = event.clientY;
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
          }
        );
        this.unListenMouseUp = this.renderer2.listen(
          this.ctx.canvas,
          'pointerup',
          (event) => {
           if(this.pointerId == event.pointerId){
            console.log("up");
            event.preventDefault();
            this.resetSteering();
            this.unListenMouseMove();
            this.unListenMouseUp();
           }
          }
        );
      }
    }
  }

  public update() {
    this.draw();
  }

  private resetSteering() {
    if (this.rotation != 0) {
      console.log("reset");
      this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        console.log("resetpos");
        this.resetPos();
      }, 0.05);
    })
    }
  }

  public resetPos() {
    if (this.rotation > (3 * Math.PI) / 180) {
      this.rotation -= (3 * Math.PI) / 180;
    } else if (this.rotation < (-3 * Math.PI) / 180) {
      this.rotation += (3 * Math.PI) / 180;
    } else {
      this.rotation = 0;
      if (this.intervalId != 0) {
        console.log("inteval cleared");
        clearInterval(this.intervalId);
        this.intervalId = 0;
      }
    }
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
