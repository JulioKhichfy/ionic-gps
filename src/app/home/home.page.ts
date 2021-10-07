import { Component } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationCurrentPositionConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { ReportModel } from '../model/report.model';
import { SignalModel } from '../model/signal.model';

const currentPositionConfig: BackgroundGeolocationCurrentPositionConfig = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
  isStarted:boolean = false;
  locations:SignalModel[];
  signal:SignalModel;
  report:ReportModel;
  arr:SignalModel[];
  lostSignals=0;
  interval:any;
  cronometro:any
  counter: { sec: number }
  
  constructor(private backgroundGeolocation: BackgroundGeolocation) {
    this.locations = [];
    this.arr = [];
    this.signal = new SignalModel(0,0,0,0);
    this.report = new ReportModel(0,0,0,0);
  }

  startBackgroundTracking(){
    this.isStarted = true;
    this.configure();
  }

  configure(){
    this.startTimer();
    this.interval = setInterval(() => {
      this.backgroundGeolocation.getCurrentLocation(currentPositionConfig).then((location:BackgroundGeolocationResponse) => {
        
        this.signal.latitude  = location.latitude;
        this.signal.longitude = location.longitude;
        this.signal.speed = location.speed;
        this.signal.time = location.time;

        console.log(">> location.latitude " + location.latitude)
        console.log(">> location.longitude " + location.longitude)
        console.log(">> location.speed " + location.speed)
        console.log(">> location.time " + location.time)

        this.insertInStorage(this.signal);

      }).catch(error => {
          console.log('***********  PERDEMOS ' + this.lostSignals++ );
          console.log('*********** ' + error.message );
      });
    },10000);
  }

  startTimer() {
    this.counter = { sec: 10 } // choose whatever you want
    this.cronometro = setInterval(() => {
      if (this.counter.sec - 1 == -1) {
        this.counter.sec = 10
      } 
      else this.counter.sec -= 1
    }, 1000)
  }

  insertInStorage(signal){
    var locationStr = localStorage.getItem("location");
    if(locationStr == null){
      this.arr.push(signal)
    } else {
      var locationarr = JSON.parse(locationStr);
      this.arr = locationarr;
      this.arr.push(signal);
    }
    localStorage.setItem("location", JSON.stringify(this.arr));
  }

  registerForeGroundSignal(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe(()=>{
      console.log("BackgroundGeolocationEvents.foreground")
    });
  }

  registerBackGroundSignal(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe(()=>{
      console.log("BackgroundGeolocationEvents.background");
    });
  }

  registerStationarySignal(){
    this.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe(()=>{
      console.log("BackgroundGeolocationEvents.stationary");
    });
  }

  stopBackgroundTracking(){
    this.isStarted = false;
    this.lostSignals = 0;
    clearInterval(this.interval);
    clearInterval(this.cronometro);
  }

  getLocations(){
    this.locations = (JSON.parse(localStorage.getItem("location")) == null) ? [] : JSON.parse(localStorage.getItem("location"));
    this.report.quantity = this.locations.length;
    this.report.lostSignals = this.lostSignals;
    let finalDate = new Date(this.locations[0].time);
    let initialDate = new Date(this.locations[this.locations.length -1].time);
    this.report.initialDate = initialDate.getHours()+":"+initialDate.getMinutes()+":"+initialDate.getSeconds();
    this.report.finalDate = finalDate.getHours()+":"+finalDate.getMinutes()+":"+finalDate.getSeconds();
  }

  clearLocations(){
    localStorage.removeItem("location");
    this.locations = [];
    this.arr = [];
    this.report.quantity = 0;
    this.lostSignals = 0;
  }
  
}