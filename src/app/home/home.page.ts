import { Component, OnInit } from '@angular/core';
import { BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { Subscription } from 'rxjs';
import { ReportModel } from '../model/report.model';
import { SignalModel } from '../model/signal.model';

declare var window
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
 
  isStarted:boolean = false;
  locations:SignalModel[]
  foreSignal:SignalModel = new SignalModel(0,0,0,0);
  signalSubscription : Subscription;
  interval:any;
  report:ReportModel = new ReportModel(0,0,0);
  constructor() {
    this.locations = [];
  }

  ngOnInit(): void {
    this.getCurrentCoordinates();
  }

  getCurrentCoordinates() {
    this.interval = setInterval(() => {
      this.foreSignal;
    },5000);
  }

  subscribeSignal(){
    this.signalSubscription = window.app.signalSubject.subscribe((signal:SignalModel)=>{
      console.log(JSON.stringify(signal));
      this.foreSignal = signal;
    })
  }

  registerForeGroundSignal(){
    window.app.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe(()=>{
      //FOREGROUND: 1
      console.log("BackgroundGeolocationEvents.foreground")
      window.app.backgroundGeolocation.switchMode(1);
    });
  }

  registerBackGroundSignal(){
    window.app.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe(()=>{
      //BACKGROUND: 0
      console.log("BackgroundGeolocationEvents.background");
      window.app.backgroundGeolocation.switchMode(0);
    });
  }

  registerStationarySignal(){
    window.app.backgroundGeolocation.on(BackgroundGeolocationEvents.stationary).subscribe(()=>{
      //BACKGROUND: 0
      console.log("BackgroundGeolocationEvents.stationary");
      
    });
  }

  startBackgroundTracking(){
    this.isStarted = true;
    window.app.backgroundGeolocation.start();
    this.registerForeGroundSignal();
    this.registerBackGroundSignal();
    this.registerStationarySignal();
    this.subscribeSignal();
  }

  stopBackgroundTracking(){
    this.isStarted = false;
    clearInterval(this.interval);
    this.signalSubscription?.unsubscribe();
    window.app.backgroundGeolocation.removeAllListeners(BackgroundGeolocationEvents.background);
    window.app.backgroundGeolocation.removeAllListeners(BackgroundGeolocationEvents.foreground);
    window.app.backgroundGeolocation.removeAllListeners(BackgroundGeolocationEvents.stationary);
    window.app.backgroundGeolocation.stop();
  }

  getLocations(){
    this.locations = (JSON.parse(localStorage.getItem("location")) == null) ? [] : JSON.parse(localStorage.getItem("location"));
    this.report.quantity = this.locations.length;
    let finalDate = new Date(this.locations[0].time);
    let initialDate = new Date(this.locations[this.locations.length -1].time);
    this.report.initialDate = initialDate.getHours()+":"+initialDate.getMinutes()+":"+initialDate.getSeconds();
    this.report.finalDate = finalDate.getHours()+":"+finalDate.getMinutes()+":"+finalDate.getSeconds();
  }

  clearLocations(){
    localStorage.removeItem("location");
    this.locations = [];
    this.report.quantity = 0;
  }
  
}