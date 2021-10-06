import { Component, OnInit } from '@angular/core';
import { BackgroundGeolocationConfig, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { Subscription } from 'rxjs';
import { SignalModel } from '../model/signal.model';

declare var window
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  
  locations:any
  foreSignal:SignalModel = new SignalModel(0,0,0,0);
  signalSubscription : Subscription;
  
  constructor() {
    this.locations = [];
    
  }
  ngOnInit(): void {
    
  }

  subscribeSignal(){
    this.signalSubscription = window.app.signalSubject.subscribe((s:SignalModel)=>{
      console.log(JSON.stringify(s));
      this.foreSignal.latitude = s.latitude;
      this.foreSignal.longitude = s.longitude;
      this.foreSignal.time = s.time;
      this.foreSignal.speed = s.speed;
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
      console.log("BackgroundGeolocationEvents.background")
      window.app.backgroundGeolocation.switchMode(0);
    });
  }

  startBackgroundTracking(){
    window.app.backgroundGeolocation.start();
    this.registerForeGroundSignal();
    this.registerBackGroundSignal();
    if(!this.signalSubscription)this.subscribeSignal();
    
  }

  stopBackgroundTracking(){
    window.app.backgroundGeolocation.stop();
  }

  getLocations(){
    this.locations = (JSON.parse(localStorage.getItem("location")) == null) ? [] : JSON.parse(localStorage.getItem("location"));
  }

  clearLocations(){
    localStorage.removeItem("location");
    this.locations =[];
  }
  
}