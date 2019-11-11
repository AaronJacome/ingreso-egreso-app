import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {
  subcription = new Subscription()
  nombre:string
  constructor(
    private store:Store<AppState>,
    public authService:AuthService,
    public ingresoEgresoService:IngresoEgresoService
  ) { }

  ngOnInit() {
    this.subcription = this.store.select('auth').pipe(
      filter(auth => auth.user != null
      )
    ).subscribe(auth =>{
      this.nombre = auth.user.nombre
    })
  }

  ngOnDestroy(){
    this.subcription.unsubscribe()
  }

  logout(){
    this.authService.logout()
    this.ingresoEgresoService.cancelarSubscription()
  }

}
