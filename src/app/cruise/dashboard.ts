import { Indicators } from './Indicators';
import { SocketService } from './../socketservice.service';
import { RouterModule } from '@angular/router';
import { Pedal } from './Pedal';
import { Renderer2, NgZone } from '@angular/core';
import { Steering } from './steering';
import { DeviceConfigurationService } from './../device-configuration.service';

declare function drawHello(speedometerValue, tachometerValue, gasValue, mileage, turnSignals, iconStates);
declare function resizeSpeedometer(ct, w, h);

export class Dashboard{

  public steer;
  public pedals;
  public resizeSpeedometer = resizeSpeedometer;
  public ledCase = 0;
  private ledCases : Array<{x:number , y:number}> = [];
  public indicator;
  public turn= {
    left : false,
    right : false
  };
  public indicators = {
    'dippedBeam': 1,
    'brake':      1,
    'drift':      1,
    'highBeam':   1,
    'lock':       1,
    'seatBelt':   1,
    'engineTemp': 2,
    'stab':       1,
    'abs':        1,

    'gas':        2,
    'trunk':      1,
    'bonnet':     1,
    'doors':      1,

    'battery':    2,
    'oil':        2,
    'engineFail': 2
  }
  public speed;
  public carConfig = {
    topSpeed : 100,
  }

  constructor(private ctx: CanvasRenderingContext2D,
    private renderer2:Renderer2,
    private deviceConf : DeviceConfigurationService,
    private ngZone:NgZone
    ){
    this.steer = new Steering(ctx,renderer2,deviceConf, ngZone);
    this.pedals = new Pedal(ctx, renderer2,deviceConf);
    this.indicator = new Indicators(ctx , renderer2 ,deviceConf, ngZone);
    this.calculatePos(this.ctx.canvas.width, this.ctx.canvas.height);
    resizeSpeedometer(this.ctx, this.ctx.canvas.width , this.ctx.canvas.height);
    this.speed = 0;
  }

  public placeLed(){
    var ch = this.ctx.canvas.height;
    var cw= this.ctx.canvas.width;
    var x = 23 * cw /100;
    var y = 20 * ch /100;
    var startDeg = 30;
    var endDeg = 180;
    var count =6;
    var gap = (endDeg - startDeg)/count;

    var radius = ((ch / 2 +
    (ch / 2 - ch / 2 * Math.sin(this.deg2Rad(50))) / 2 -
    4))/2 + 20;
    console.log(radius, ch , cw , gap);
    for(let i = 0; i<count; i++){
      var yl = y - Math.sin(this.deg2Rad(startDeg + i*gap)) * radius;
      var xl = x - Math.cos(this.deg2Rad(startDeg + i*gap)) * radius;
      var a = {x, y};
      a.x = xl + 27 * cw /100;
      a.y = yl + 35 * ch/100;
      this.ledCases.push(a);
      // console.log(xl,yl);
      // this.renderer2.setStyle(.nativeElement , 'left' , xl);
      // this.renderer2.setStyle(this.ledCases[i].nativeElement , 'top' , yl);
    }

  }

  public calculatePos(x, y){
    this.steer.calculatePos(x,y);
    this.pedals.calculatePos(x,y);
    this.indicator.calculatePos(x,y);
    // this.placeLed();
  }
  public isClicked(e){
    this.steer.isClicked(e);
    this.pedals.isClicked(e);
    this.indicator.isClicked(e);
  }

  public update(){
    this.steer.update();
    this.pedals.update();
    this.indicator.update();
    this.calculateSpeed();
    drawHello(this.speed/100, this.speed/100, 0.5, 100, this.turn, this.indicators);
  }

  calculateSpeed(){
    if(this.pedals.break.pressed){
      if(this.speed > 0){
        this.speed -= 0.5;
      }
    }
    else if (this.pedals.gas.pressed){
      if(this.speed < this.carConfig.topSpeed){
        this.speed += 0.5;
      }
    }
    else {
      if (this.speed > 0) {
        this.speed -= 0.2;
      }
    }

    if(this.steer.rotation < 0){
      this.turn.left = true;
      this.turn.right = false;
    }
    else if(this.steer.rotation >0){
      this.turn.right = true;
      this.turn.left = false;
    }else {
      this.turn.right = false;
      this.turn.left = false;
    }
  }

  deg2Rad(deg) {
    return deg * (Math.PI / 180);
}

}
