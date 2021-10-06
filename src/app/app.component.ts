import { Component, OnInit } from '@angular/core';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents}
  from '@ionic-native/background-geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { SignalModel } from './model/signal.model';

declare var window;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  arr:any;
  signal:SignalModel;
  signalSubject:Subject<any>;
  
  constructor(private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation) {
      this.arr = [];
      this.signalSubject = new Subject();
      this.signal = new SignalModel(0,0,0,new Date().getTime())
    }
  
    ngOnInit(): void {
      this.initializeApp();
    }

    async initializeApp() {
      await this.platform.ready();
      this.configure();
      try{
        localStorage.removeItem("location");
      }catch(err){
        console.log("Garante a limpeza do cache no inicio");
      }
    }
 
    async configure(){
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 10,
        distanceFilter: 10,
        interval:5000,
        activitiesInterval: 5000,
        debug: false, 
        stopOnTerminate: false,
        startForeground:true
      }

      await this.backgroundGeolocation.configure(config).then(()=>{
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
          (location:BackgroundGeolocationResponse) => {
            this.signal.latitude  = location.latitude;
            this.signal.longitude = location.longitude;
            this.signal.speed = location.speed;
            this.signal.time = location.time;

            var locationStr = localStorage.getItem("location");
            if(locationStr == null){
              this.arr.push(this.signal)
            } else {
              var locationarr = JSON.parse(locationStr);
              this.arr = locationarr;
              this.arr.push(this.signal);
            }
            localStorage.setItem("location", JSON.stringify(this.arr));
            this.signalSubject.next(this.signal);
        });
      });
      window.app = this;
    }
}