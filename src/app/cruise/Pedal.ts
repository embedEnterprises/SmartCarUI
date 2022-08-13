import { Renderer2 } from '@angular/core';
import { DeviceConfigurationService } from './../device-configuration.service';

export class Pedal {
  private img;
  private break = {
    x: 5,
    y: 60,
    w: 10,
    h: 25,
    posX: 200,
    posY: 400,
    width: 100,
    height: 200,
    path: new Path2D(),
    pressed: false,
    pointerId: undefined,
  };

  private gas = {
    x: 17,
    y: 60,
    w: 10,
    h: 25,
    posX: 350,
    posY: 400,
    width: 100,
    height: 200,
    path: new Path2D(),
    pressed: false,
    pointerId: undefined,
  };

  private strokeStyle = 'black';
  private lineWidth = 8;
  private unListenMouseUp: () => void;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer2: Renderer2,
    private deviceConf: DeviceConfigurationService
  ) {
    this.img = new Image();
    this.img.src =
      // 'https://cdn-icons.flaticon.com/png/512/2087/premium/2087078.png?token=exp=1657170801~hmac=a6a562a03756055ad695a780f2ae2797';
      'assets/breakpedal.jpg';

    this.ctx.strokeStyle = this.strokeStyle;
    this.ctx.lineWidth = this.lineWidth;
    this.calculatePos(this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public calculatePos(w, h) {
    this.break.posX = (this.break.x / 100) * w;
    this.break.posY = (this.break.y / 100) * h;
    this.gas.posX = (this.gas.x / 100) * w;
    this.gas.posY = (this.gas.y / 100) * h;
    this.break.width = (this.break.w / 100) * w;
    this.break.height = (this.break.h / 100) * h;
    this.gas.width = (this.gas.w / 100) * w;
    this.gas.height = (this.gas.h / 100) * h;
    this.gas.path.rect(
      this.gas.posX,
      this.gas.posY,
      this.gas.width,
      this.gas.height
    );
    this.break.path.rect(
      this.break.posX,
      this.break.posY,
      this.break.width,
      this.break.height
    );
  }

  public isClicked(e) {
    var eventName = '';
    var x;
    var y;
    if (this.deviceConf.getDeviceType() == 'desktop') {
      eventName = 'mouseup';
      x = e.pageX;
      y = e.pageY;
    } else if (this.deviceConf.getDeviceType() == 'mobile') {
      eventName = 'pointerup';
      x = e.clientX;
      y = e.clientY;
    }
    if (this.ctx.isPointInPath(this.break.path, x, y)) {
      this.break.pressed = true;
      if (eventName == 'pointerup') {
        this.break.pointerId = e.pointerId;
      }

      this.unListenMouseUp = this.renderer2.listen(
        this.ctx.canvas,
        eventName,
        (event) => {
          if (this.break.pointerId == event.pointerId) {
            this.break.pressed = false;
            this.unListenMouseUp();
          }
        }
      );
    } else if (this.ctx.isPointInPath(this.gas.path, x, y)) {
      this.gas.pressed = true;
      if (eventName == 'pointerup') {
        this.gas.pointerId = e.pointerId;
      }
      this.unListenMouseUp = this.renderer2.listen(
        this.ctx.canvas,
        eventName,
        (event) => {
          if (this.gas.pointerId == event.pointerId) {
            this.gas.pressed = false;
            this.unListenMouseUp();
          }
        }
      );
    }
  }

  public update() {
    this.draw();
  }

  public draw() {
    this.drawBreak();
    this.drawGas();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  private drawGas() {
    if (this.gas.pressed) {
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(
      this.img,
      0,
      0,
      this.img.width / 2,
      this.img.height - 80,
      this.gas.posX,
      this.gas.posY,
      this.gas.width,
      this.gas.height
    );
  }
  private drawBreak() {
    if (this.break.pressed) {
      this.ctx.setTransform(1, 0, 0, 0.8, 0, 70);
    } else {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.ctx.drawImage(
      this.img,
      this.img.width / 2,
      0,
      this.img.width / 2,
      this.img.height - 80,
      this.break.posX,
      this.break.posY,
      this.break.width,
      this.break.height
    );
  }
}
