import { TabsPage } from './../tabs/tabs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { User } from '../../models/user';
import firebase from 'firebase';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

 user = {} as User;
 
  constructor(private afAuth:AngularFireAuth, private nav: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, public alert: AlertController) { }
 
 async login(){
 //  if(this.afAuth.auth.currentUser.emailVerified){
try{
const result = await this.afAuth.auth.signInWithEmailAndPassword(this.user.email,this.user.password)
console.log(result);
if (result){
  if(this.afAuth.auth.currentUser.emailVerified){
  this.nav.setRoot(TabsPage);
  console.log(this.afAuth.auth.currentUser);
  }
else if (!this.afAuth.auth.currentUser.emailVerified){
  this.afAuth.auth.signOut();
  let alert2 = this.alert.create({
    title: 'Error',
    subTitle: "Your Email address has either not been verified or has not been registered, please enter a valid email",
    buttons: ['OK']
  });
  alert2.present();
}


}
}
catch (error) {
 
  let alert = this.alert.create({
    title: 'Error',
    subTitle: error ,
    buttons: ['OK']
  });
  
  alert.present();

}
//}

 }




register(){
  this.nav.push("RegisterPage");
}


resetpwd(){
  this.nav.push("ResetpwdPage");
}


}