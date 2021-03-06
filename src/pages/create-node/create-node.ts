import { User } from './../../models/user';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Alert } from 'ionic-angular';
import { Http, Headers } from "@angular/http";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Node } from '../../models/node';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFireAuth } from "angularfire2/auth"
/**
 * Generated class for the CreateNodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-node',
  templateUrl: 'create-node.html',
})
export class CreateNodePage {


  node = {} as Node;
  authState: any = null;
  start: any;
  userId: any;
  isOwner: any;


  constructor(private afAuth: AngularFireAuth, public alert: AlertController, public http: Http, public navCtrl: NavController, public navParams: NavParams) {


    this.node.address = navParams.get('param1');
    this.node.lat = navParams.get('param2');
    this.node.lng = navParams.get('param3');


    this.afAuth.authState.subscribe((auth) => {
      this.authState = auth
    });

    this.userId =this.afAuth.auth.currentUser.uid
   

    this.http.get('http://colinfyp.bitnamiapp.com/data_marker/myNodeData.php?userId='+this.userId)
    .map(res => res.json())
    .subscribe(u => {

    
    this.setUserVariables(u);
     
  
     

      if (u == null) {
        console.log("problem");
      }
      

    });



  }

  setUserVariables(user){

    for(let u of user){

      try{

   
        this.isOwner = u.nodeOwnerId;;
  
      
      }catch( error){

      }

  }
}



  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNodePage');
  }

  createNode(): void {

    try{

    var start = this.node.availabilityTimeStart;
    var finish = this.node.availabilityTimeFinish;
    console.log(start);
    console.log(finish);
    console.log("JAYYYYSUS");
    var diff = finish - start;

    console.log("CURRENT:"+ this.authState.uid);
    console.log("isWONER"+ this.isOwner);
    if (this.isOwner == this.authState.uid){


      let alert = this.alert.create({
        title: 'Error!',
        subTitle: 'Only One Charge Point Per User!',
        buttons: ['OK']
      });

      alert.present();
    
     
    }
else 
if (isNaN(this.node.costPer15Mins) || this.node.costPer15Mins < 0){

  let alert = this.alert.create({
    title: 'Error!',
    subTitle: "You must enter a valid Charge Point Cost",
    buttons: ['OK']
  });

  alert.present();
}else

  if (this.node.chargerType != null && this.node.availabilityTimeStart != null) {





      console.log(this.node.availabilityTimeStart);
      console.log(this.node.availabilityTimeFinish);
      console.log("hello");


      if (diff > 0) {

        console.log(this.node);

        let options: any = { 'chargerType': this.node.chargerType, 'lat': this.node.lat, 'lng': this.node.lng, 'address': this.node.address, 'uuid': this.authState.uid, 'startTime': this.node.availabilityTimeStart, 'finishTime': this.node.availabilityTimeFinish, "costPer15Mins": this.node.costPer15Mins },
          url: any = 'http://colinfyp.bitnamiapp.com/data_marker/createNode.php';
        console.log(options);

        this.http.post(url, JSON.stringify(options))
          .subscribe((data: any) => {

            console.log("success");
            console.log("jump " + this.authState.uid);
            this.navCtrl.setRoot(TabsPage);
          },
          (error: any) => {
            console.log("HEYY" + error);

            let alert = this.alert.create({
              title: 'Error!',
              subTitle: 'Please ensure your device is connected to the internet.',
              buttons: ['OK']
            });

            alert.present();
          });
      }
      else {
        console.log("error2")

        let alert = this.alert.create({
          title: 'Error!',
          subTitle: 'Start Time cannot be later than finish time',
          buttons: ['OK']
        });

        alert.present();
      }

    }
    else {
      console.log("error1")

      let alert = this.alert.create({
        title: 'Error!',
        subTitle: 'Please ensure all fields are filled out.',
        buttons: ['OK']
      });

      alert.present();
    }

  } catch(e){
    let alert = this.alert.create({
      title: 'Error!',
      subTitle: "Something went wrong, please try again!",
      buttons: ['OK']
    });

    alert.present();
  }

  }


}