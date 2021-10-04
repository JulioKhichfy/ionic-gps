import { Component } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents}
  from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';

declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  arr:any;

  constructor(private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation) {
      this.arr = [];
      this.initializeApp();
    }

    initializeApp() {
      this.platform.ready().then(() => {
        const config: BackgroundGeolocationConfig = {
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          debug: true, 
          stopOnTerminate: false
        }
  
        this.backgroundGeolocation.configure(config).then(()=>{
          this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
            (location:BackgroundGeolocationResponse) => {
              var locationStr = localStorage.getItem("location");
              if(locationStr == null){
                this.arr.push(location)
              } else {
                var locationarr = JSON.parse(locationStr);
                this.arr = locationarr;
              }
              localStorage.setItem("location", JSON.stringify(this.arr));
          });
        });
        window.app = this;
      });
    }
}