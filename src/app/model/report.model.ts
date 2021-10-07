export class ReportModel {

    quantity:number;
    initialDate:string;
    finalDate:string;

    constructor(quantity, initialDate, finalDate){
        this.quantity = quantity;
        this.initialDate = initialDate;
        this.finalDate = finalDate;
    }
}