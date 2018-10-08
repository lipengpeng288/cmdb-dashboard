import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'uppercase'})
export class uppercasePipe implements PipeTransform{
    transform (value:string){
        if(value=="cpu"){
            return "CPU"
        }
        if(value=="base_freq"){
            return "Base Frequency";
        }
        value=value.replace(/dimms$/i,"DIMMs");
        value=value.replace(/ip/i,"IP");
        let i=value.indexOf("_");
        if(i>0){
            let va=value.split("_");
            for(let i=0;i<va.length;i++){
                va[i]=va[i].slice(0,1).toUpperCase()+va[i].slice(1,va[i].length);
            }
            return va.join(" ");
        }else{
            return  value.slice(0,1).toUpperCase()+value.slice(1,value.length);
        }
    }
}