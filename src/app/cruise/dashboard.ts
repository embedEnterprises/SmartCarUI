import { RouterModule } from '@angular/router';
import { Pedal } from './Pedal';
import { Renderer2 } from '@angular/core';
import { Steering } from './steering';

declare function drawHello(speedometerValue, tachometerValue, gasValue, mileage, turnSignals, iconStates);
declare function init(ct);

export class Dashboard{

  private steer;
  private pedals;
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

  constructor(private ctx: CanvasRenderingContext2D, private renderer2:Renderer2){
    this.steer = new Steering(ctx,renderer2);
    this.pedals = new Pedal(ctx, renderer2);
    init(this.ctx);
    this.speed = 0;
  }

  public isClicked(x , y){
    this.steer.isClicked(x, y);
    this.pedals.isClicked(x , y);
  }

  public update(){
    this.steer.update();
    this.pedals.update();
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

}
