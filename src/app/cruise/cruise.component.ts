import { Dashboard } from './dashboard';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, NgZone, Renderer2, HostListener } from '@angular/core';

@Component({
  selector: 'app-cruise',
  templateUrl: './cruise.component.html',
  styleUrls: ['./cruise.component.scss'],
})
export class CruiseComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;
  requestId: number;
  private dashboard;
  private unListenMouseDown: () => void;
  private canvas;
  constructor(private ngZone: NgZone, private renderer2: Renderer2) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.width = event.target.innerWidth;
    this.canvas.height = event.target.innerHeight;
    console.log(this.canvas.width);
  }

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    this.dashboard = new Dashboard(this.ctx, this.renderer2);
    this.unListenMouseDown = this.renderer2.listen(
      this.canvas,
      'mousedown',
      (event) => {
        this.dashboard.isClicked(event.pageX, event.pageY);
      }
    );
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.dashboard.update();
    this.requestId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy() {
    this.unListenMouseDown();
    cancelAnimationFrame(this.requestId);
  }
}
