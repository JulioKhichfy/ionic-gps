export class ReportModel {

    quantity:number;
    initialDate:string;
    finalDate:string;
    lostSignals:number;

    constructor(quantity, initialDate, finalDate, lostSignals){
        this.quantity = quantity;
        this.initialDate = initialDate;
        this.finalDate = finalDate;
        this.lostSignals = lostSignals;
    }
}