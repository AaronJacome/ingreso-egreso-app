import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando:boolean
  subcription:Subscription
  constructor(
    public authService:AuthService,
    public store:Store<AppState>
  ) { }

  ngOnInit() {
    this.subcription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading
    })
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }

  login(data){
    console.log(data)
    this.authService.login(data.correo,data.password);
  }
}
