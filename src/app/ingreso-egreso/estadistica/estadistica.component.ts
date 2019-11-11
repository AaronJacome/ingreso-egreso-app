import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { AppState } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit {

  totalIngresos:number
  totalEgresos:number

  countIngresos:number;
  countEgresos:number

  subscription = new Subscription()

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: number[] = [];
  public doughnutChartType: ChartType = 'doughnut';

  constructor(
    private store:Store<AppState>
  ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso').subscribe((ingresoEgreso) =>{
      this.contarIngresoEgreso(ingresoEgreso.items)
    })
  }

  contarIngresoEgreso(items:IngresoEgreso[]){
    this.totalEgresos = 0;
    this.totalIngresos = 0;

    this.countEgresos = 0;
    this.countIngresos = 0;
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      if(element.tipo === 'ingreso'){
        this.totalIngresos += element.monto
        this.countIngresos += 1
      }else{
        this.totalEgresos += element.monto
        this.countEgresos += 1
      }
    }

    this.doughnutChartData = [this.totalIngresos, this.totalEgresos]
  }

}
