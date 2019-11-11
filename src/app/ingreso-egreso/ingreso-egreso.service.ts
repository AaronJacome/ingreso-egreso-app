import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSub:Subscription = new Subscription();
  ingresoEgresoItemsSub:Subscription = new Subscription();
  
  constructor(
    private afDB: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>
  ) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUsuario();
    return this.afDB.doc(`${user.uid}/ingreso-egreso`).collection('items').add({ ...ingresoEgreso });
  }

  private ingresoEgresoItems(uid:string){
    this.ingresoEgresoItemsSub = this.afDB.collection(`${uid}/ingreso-egreso/items`).snapshotChanges().pipe(map(docData =>{
      return docData.map( doc =>{
        return {
          uid:doc.payload.doc.id,
          ...doc.payload.doc.data()
        }
      })
    })).subscribe((collection:any[]) =>{
      this.store.dispatch(new SetItemsAction(collection))
    })
  }

  cancelarSubscription(){
    this.ingresoEgresoListenerSub.unsubscribe();
    this.ingresoEgresoItemsSub.unsubscribe();
    this.store.dispatch(new UnsetItemsAction())
  }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSub = this.store.select('auth').pipe(
      filter(auth => auth.user != null)
    ).subscribe(auth => {
      this.ingresoEgresoItems(auth.user.uid)
    })
  }

  borrarIngresoEgreso(uid:string){
    const user = this.authService.getUsuario();
    return this.afDB.doc(`${user.uid}/ingreso-egreso/items/${uid}`).delete()
  }
}
