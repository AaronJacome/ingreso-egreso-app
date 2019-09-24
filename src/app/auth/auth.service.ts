import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import * as firebase from 'firebase' 
import {map} from 'rxjs/operators'
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription:Subscription = new Subscription();

  constructor(
    private afAuth: AngularFireAuth,
    private router:Router,
    private afDB: AngularFirestore,
    private store:Store<AppState>
  ) { }

  initAuthListener(){
    this.afAuth.authState.subscribe((fbUser:firebase.User) =>{
      if(fbUser){
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges().subscribe((usuarioObj:any) =>{
          const newUser = new User(usuarioObj)
          this.store.dispatch(new SetUserAction(newUser))
        })
      }else{
        this.userSubscription.unsubscribe();
        this.isAuth();
      }
    })
  }

  crearUsuario(nombre:string, email:string, password:string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(resp => {
      const user:User = {
        nombre : nombre,
        email : email,
        uid : resp.user.uid
      }

      this.afDB.doc(`${user.uid}/usuario`).set(user).then(()=>{
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(["/"]);    
      })  
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire('Error',error.message,'error');
    })
  }

  login(correo:string,password:string){
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(correo,password).then(resp => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.router.navigate(["/"]);
    }).catch(error => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire('Error',error.message,'error');
    })
  }

  logout(){
    this.router.navigate(['/login'])
    this.afAuth.auth.signOut();
  }

  isAuth(){
    return this.afAuth.authState.pipe(
      map(fbUser => {
        if(fbUser === null){
          this.router.navigate(['/login'])
        }

        return fbUser !==null
      })
    );
  }
}
