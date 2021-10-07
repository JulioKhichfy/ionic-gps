import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';
import { SignalModel } from './model/signal.model';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  
  constructor(private platform: Platform) {}
  
    ngOnInit(): void {
      this.initializeApp();
    }

    async initializeApp() {
      await this.platform.ready();
      localStorage.removeItem("location");
    }
}