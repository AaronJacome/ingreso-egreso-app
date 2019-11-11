import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit,OnDestroy {
  subcription = new Subscription()
  nombre:string
  constructor(
    private store:Store<AppState>
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

}
