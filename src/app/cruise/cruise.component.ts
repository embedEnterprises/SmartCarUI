import { Steering } from './steering';
import { SocketService } from './../socketservice.service';
import { WebsocketService } from './../websocket.service';
import { DeviceConfigurationService } from './../device-configuration.service';
import { Dashboard } from './dashboard';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  NgZone,
  Renderer2,
  HostListener,
} from '@angular/core';
import { WebsocketRxjsService } from '../websocket-rxjs.service';

@Component({
  selector: 'app-cruise',
  templateUrl: './cruise.component.html',
  styleUrls: ['./cruise.component.scss'],
  providers: [DeviceConfigurationService, SocketService, WebsocketService],
})
export class CruiseComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvasRef: ElementRef<HTMLCanvasElement>;

  public ctx: CanvasRenderingContext2D;
  requestId: number;
  private dashboard;
  private unListenMouseDown: () => void;
  private unListenTouchDown: () => void;
  private canvas;
  private message;
  private prevMessage;
  private resultMessage;
  private intervalId;
  public arr;

  constructor(
    // private socket: SocketService,
    private wscService: WebsocketRxjsService,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private deviceConf: DeviceConfigurationService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.canvas.width = event.target.innerWidth;
    this.canvas.height = event.target.innerHeight;
    this.dashboard.calculatePos(this.canvas.width, this.canvas.height);
    this.dashboard.resizeSpeedometer(
      this.ctx,
      this.canvas.width,
      this.canvas.height
    );
  }

  ngOnInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');
    // console.log(this.led1);
    this.dashboard = new Dashboard(
      this.ctx,
      this.renderer2,
      this.deviceConf,
      this.ngZone,
      this.wscService
    );
    this.dashboard.placeLed();
    this.arr = this.dashboard.ledCases;
    console.log(this.arr);
    if (this.deviceConf.getDeviceType() == 'desktop') {
      this.unListenMouseDown = this.renderer2.listen(
        this.canvas,
        'mousedown',
        (event) => {
          this.ngZone.runOutsideAngular(() => {
            this.dashboard.isClicked(event.pageX, event.pageY);
          });
        }
      );
    } else if (this.deviceConf.getDeviceType() == 'mobile') {
      this.ngZone.runOutsideAngular(() => {
        this.unListenTouchDown = this.renderer2.listen(
          this.canvas,
          'pointerdown',
          (event) => {
            event.preventDefault();
            this.ngZone.runOutsideAngular(() => {
              event.preventDefault();
              this.dashboard.isClicked(event);
            });
          }
        );
      });
    }
    this.animate();
  }

  ngAfterViewInit() {
    // this.dashboard.placeLed();
    // this.arr = this.dashboard.ledCases;
  }


  animate() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.dashboard.update();
    this.requestId = requestAnimationFrame(() => this.animate());
  }

  ledClick(event : any){
    this.dashboard.ledCase = event.path[1].id;
    this.wscService.send("l" + this.dashboard.ledCase);
  }

  ngOnDestroy() {
    this.unListenMouseDown();
    cancelAnimationFrame(this.requestId);
  }
}
