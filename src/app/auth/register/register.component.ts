import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  cargando:boolean;
  subcription:Subscription

  constructor(
    public authService:AuthService,
    public store:Store<AppState>
  ) { }

  ngOnInit() {
    this.subcription = this.store.select('ui').subscribe(ui =>{
      this.cargando = ui.isLoading;
    })
  }

  ngOnDestroy(){
    this.subcription.unsubscribe();
  }

  onSubmit(data:any){
    this.authService.crearUsuario(data.nombre,data.correo,data.password);
  }

}
