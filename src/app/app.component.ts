import { Component } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents}
  from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';
import { SignalModel } from './model/signal.model';

declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  arr:any;
  signal:SignalModel;
  constructor(private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation) {
      this.arr = [];
      this.signal = new SignalModel(0,0,0,new Date().getTime())
      this.initializeApp();
    }

    initializeApp() {
      this.platform.ready().then(() => {
        const config: BackgroundGeolocationConfig = {
          desiredAccuracy: 0,
          stationaryRadius: 1,
          distanceFilter: 1,
          interval:5000,
          debug: true, 
          stopOnTerminate: false
        }
  
        this.backgroundGeolocation.configure(config).then(()=>{
          this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
            (location:BackgroundGeolocationResponse) => {
              this.signal.latitude  = location.latitude;
              this.signal.longitude = location.longitude;
              this.signal.speed = location.speed;
              this.signal.time = location.time;
              this.arr.push(this.signal);
              console.log(JSON.stringify(this.arr));
              console.log("***********************");
              localStorage.setItem("location", JSON.stringify(this.arr));
          });
        });
        window.app = this;
      });
    }
}