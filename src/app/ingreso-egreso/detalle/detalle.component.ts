import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../../shared/ui.actions';
import { AppState } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {
  items: IngresoEgreso[];
  subcription = new Subscription()
  subcriptionBorrarItem = new Subscription()


  constructor(
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService
  ) { }

  ngOnInit() {
    this.subcription = this.store.select('ingresoEgreso').subscribe(ingresoEgreso => {
      this.items = ingresoEgreso.items;
    })
  }

  ngOnDestroy() {
    this.subcription.unsubscribe()
  }

  borrarItem(uid) {
    this.store.dispatch(new ActivarLoadingAction())
    this.ingresoEgresoService.borrarIngresoEgreso(uid).then(() => {
      Swal.fire('Eliminado', "Se ha borrado correctamente", 'success')
      this.store.dispatch(new DesactivarLoadingAction())
    })
  }

}
