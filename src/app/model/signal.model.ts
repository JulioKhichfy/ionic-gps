export class SignalModel {

    latitude:number;
    longitude:number;
    speed:number;
    time:number;

    constructor(latitude, longitude, speed, time){
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.time = time;
    }
}