import { NgZone, Renderer2 } from '@angular/core';
import { DeviceConfigurationService } from './../device-configuration.service';

export class Indicators {
  private img;
  private strokeStyle = 'black';
  private lineWidth = 8;
  private unListenMouseUp: () => void;
  turnSignalColor = '#57d53f';
  private x = 50;
  private y = 50;
  private posX;
  private posY;

  left = {
    x: -25,
    y: -15,
    w: -15,
    h: 20,
    posX: 200,
    posY: 400,
    width: 100,
    height: 200,
    path: new Path2D(),
    pressed: false,
    pointerId: undefined,
  };

  right = {
    x: 25,
    y: -15,
    w: 15,
    h: 20,
    posX: 200,
    posY: 400,
    width: 100,
    height: 200,
    path: new Path2D(),
    pressed: false,
    pointerId: undefined,
  };

  constructor(
    private ctx: CanvasRenderingContext2D,
    private renderer2: Renderer2,
    private deviceConf: DeviceConfigurationService,
    private ngZone: NgZone
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
    this.posX = (this.x / 100) * w;
    this.posY = (this.y / 100) * h;
    this.left.posX = (this.left.x / 100) * w;
    this.left.posY = (this.left.y / 100) * h;
    this.right.posX = (this.right.x / 100) * w;
    this.right.posY = (this.right.y / 100) * h;
    this.left.width = (this.left.w / 100) * w;
    this.left.height = (this.left.h / 100) * h;
    this.right.width = (this.right.w / 100) * w;
    this.right.height = (this.right.h / 100) * h;
    this.right.path.rect(
      this.posX + this.right.posX,
      this.posY + this.right.posY - this.right.height,
      this.right.width / 1.75,
      this.right.height
    );
    this.left.path.rect(
      this.posX + this.left.posX,
      this.posY + this.left.posY - this.left.height,
      this.left.width / 1.75,
      this.left.height
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
    if (this.ctx.isPointInPath(this.left.path, x, y)) {
      this.left.pressed = !this.left.pressed;
      this.right.pressed = false;
      if (eventName == 'pointerup') {
        this.left.pointerId = e.pointerId;
      }

      this.unListenMouseUp = this.renderer2.listen(
        this.ctx.canvas,
        eventName,
        (event) => {
          if (this.left.pointerId == event.pointerId) {
            // this.turn.left.pressed = false;
            this.unListenMouseUp();
          }
        }
      );
    } else if (this.ctx.isPointInPath(this.right.path, x, y)) {
      this.right.pressed = !this.right.pressed;
      this.left.pressed = false;
      if (eventName == 'pointerup') {
        this.right.pointerId = e.pointerId;
      }
      this.unListenMouseUp = this.renderer2.listen(
        this.ctx.canvas,
        eventName,
        (event) => {
          if (this.right.pointerId == event.pointerId) {
            // this.turn.right.pressed = false;
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
    this.drawTurnSignal(
      this.left.posX,
      this.left.posY,
      this.left.width,
      this.left.height,
      this.left.pressed
    );
    this.drawTurnSignal(
      this.right.posX,
      this.right.posY,
      this.right.width,
      this.right.height,
      this.right.pressed
    );
    // this.ctx.strokeStyle = 'red';
    // this.ctx.stroke(this.turn.left.path);
    // this.ctx.stroke(this.turn.right.path);
    // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  drawTurnSignal(offsetX, offsetY, width, height, enabled) {
    this.ctx.save();
    this.ctx.translate(this.posX, this.posY);
    this.ctx.beginPath();
    this.ctx.moveTo(offsetX, offsetY - height + height * 0.25);
    this.ctx.lineTo(
      offsetX + width - width / 1.35,
      offsetY - height + height * 0.25
    );
    this.ctx.lineTo(offsetX + width - width / 1.35, offsetY - height);
    this.ctx.lineTo(offsetX + width - width / 2.5, offsetY - height / 2);
    this.ctx.lineTo(offsetX + width - width / 1.35, offsetY);
    this.ctx.lineTo(
      offsetX + width - width / 1.35,
      offsetY - height + height * 0.75
    );
    this.ctx.lineTo(offsetX, offsetY - height + height * 0.75);
    this.ctx.closePath();
    this.ctx.fillStyle = '#161616';
    if (enabled) {
      this.ctx.fillStyle = this.turnSignalColor;
    }
    this.ctx.fill();
    this.ctx.restore();
  }
}
