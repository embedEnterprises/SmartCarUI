import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, NgZone, Renderer2 } from '@angular/core';
import { Pedal } from './Pedal';
import { Steering } from './steering';

@Component({
  selector: 'app-cruise',
  templateUrl: './cruise.component.html',
  styleUrls: ['./cruise.component.scss']
})
export class CruiseComponent implements OnInit {

  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;

  public ctx:CanvasRenderingContext2D;
  requestId:number;
  steering;
  pedal;
  canvasWidth;
  canvasHeight;
  private unListenMouseDown: () => void;

  constructor(private ngZone: NgZone, private renderer2: Renderer2) {}

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.canvasWidth = window.innerWidth;
    canvas.height = this.canvasHeight = window.innerHeight;
    this.ctx = canvas.getContext('2d');
    this.steering = new Steering(this.ctx, this.renderer2);
    this.pedal = new Pedal(this.ctx,this.renderer2);
    this.unListenMouseDown = this.renderer2.listen(canvas, "mousedown", event => {
      this.steering.isClicked(event.pageX, event.pageY);
      this.pedal.isClicked(event.pageX, event.pageY);
    });
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0,0,this.canvasWidth , this.canvasHeight);
    this.steering.update();
    this.pedal.draw();
    this.requestId = requestAnimationFrame(()=>this.animate());
  }

  ngOnDestroy() {
    this.unListenMouseDown();
    cancelAnimationFrame(this.requestId);
  }

}
