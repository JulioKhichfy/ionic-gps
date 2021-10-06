import { Component } from '@angular/core';

declare var window
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  locations:any

  constructor() {
    this.locations = [];
  }

  startBackgroundTracking(){
    window.app.backgroundGeolocation.start();
  }

  stopBackgroundTracking(){
    window.app.backgroundGeolocation.stop();
  }

  getLocations(){
    this.locations = (JSON.parse(localStorage.getItem("location")) == null) ? [] : JSON.parse(localStorage.getItem("location"));
    this.locations.forEach(element => {
      console.log(JSON.stringify(element))
    });
  }

  clearLocations(){
    localStorage.removeItem("location");
  }
  
}