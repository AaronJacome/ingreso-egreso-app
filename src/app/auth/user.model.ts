export class User{
    nombre:string;
    email:string;
    uid:string;

    constructor(obj:DataObj){
        this.nombre = obj && obj.nombre || null;
        this.email = obj && obj.email || null;
        this.uid = obj && obj.uid || null;
    }
}

interface DataObj {
    nombre:string;
    email:string;
    uid:string;
}